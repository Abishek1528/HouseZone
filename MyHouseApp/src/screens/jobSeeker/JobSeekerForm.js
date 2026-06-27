import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import Footer from "../../components/Footer";
import OwnerFormHeader from "../../shared/components/OwnerFormHeader";
import { useTheme } from "../../context/ThemeContext";
import { sanitizePhoneInput } from "../../shared/utils/phoneInput";
import { initialFormData } from "./logic/mainLogic";
import Step1PersonalDetails from "./Step1PersonalDetails";
import Step2JobRelatedDetails from "./Step2JobRelatedDetails";

const MAX_STEPS = 2;

const validateStep1 = (formData) => {
  const required = ["fullName", "mobileNumber", "age", "gender"];
  for (const field of required) {
    if (!String(formData[field] || "").trim()) {
      Alert.alert("Validation Error", "Please fill in all required personal details in Step 1.");
      return false;
    }
  }
  if (!/^\d{10}$/.test(formData.mobileNumber)) {
    Alert.alert("Validation Error", "Please enter a valid 10-digit mobile number.");
    return false;
  }
  const age = parseInt(formData.age, 10);
  if (age < 14 || age > 100) {
    Alert.alert("Validation Error", "Please enter a valid age between 14 and 100.");
    return false;
  }
  return true;
};

const validateStep2 = (formData) => {
  const required = ["currentLocation", "experience", "canJoinImmediately"];
  for (const field of required) {
    if (!String(formData[field] || "").trim()) {
      Alert.alert("Validation Error", "Please fill in all required job details in Step 2.");
      return false;
    }
  }
  return true;
};

export default function JobSeekerForm() {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const ofs = getOwnerFormStyles(colors, dark);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const prefillFromAccount = async () => {
      try {
        const stored = await AsyncStorage.getItem("userDetails");
        if (!stored) return;
        const user = JSON.parse(stored);
        const accountContact = user?.contact || user?.contact_number;
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || user?.name || "",
          mobileNumber:
            prev.mobileNumber ||
            (accountContact ? sanitizePhoneInput(String(accountContact)) : ""),
        }));
      } catch (error) {
        console.error("[JobSeekerForm] Could not prefill from account:", error);
      }
    };
    prefillFromAccount();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1(formData)) return;
    setStep((prev) => Math.min(prev + 1, MAX_STEPS));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      return;
    }
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!validateStep2(formData)) return;

    try {
      setIsSubmitting(true);
      console.log("Job seeker form submitted:", formData);

      Alert.alert("Success", "Your job seeker details saved successfully!", [
        {
          text: "OK",
          onPress: () => {
            setFormData(initialFormData);
            setStep(1);
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      handleInputChange,
      colors: ofs.themeColors,
      dark,
    };

    if (step === 1) return <Step1PersonalDetails {...stepProps} />;
    return <Step2JobRelatedDetails {...stepProps} />;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={ofs.screen}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f213d" />

      <OwnerFormHeader title="Job Seeker Profile" step={step} maxSteps={MAX_STEPS} dark={dark} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={ofs.scrollContent}
      >
        <View style={ofs.formCenterWrap}>
          {renderStep()}

          <View style={ofs.formActionsRow}>
            <TouchableOpacity
              style={[ofs.formActionBtn, ofs.formActionBtnOutline]}
              onPress={handleBack}
              disabled={isSubmitting}
            >
              <Text style={ofs.formActionBtnOutlineText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[ofs.formActionBtn, ofs.formActionBtnPrimary]}
              onPress={step < MAX_STEPS ? handleNext : handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={ofs.formActionBtnText}>
                {isSubmitting ? "..." : step < MAX_STEPS ? "Next" : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </KeyboardAvoidingView>
  );
}
