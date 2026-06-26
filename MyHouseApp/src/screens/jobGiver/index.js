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
import Step1ShopDetails from "./Step1ShopDetails";
import Step2JobDetails from "./Step2JobDetails";
import Step3ShopPhotos from "./Step3ShopPhotos";

const MAX_STEPS = 3;

const validateStep1 = (formData) => {
  const required = ["name", "shopName", "shopType", "area", "city", "contact"];
  for (const field of required) {
    if (!String(formData[field] || "").trim()) {
      Alert.alert("Validation Error", `Please fill in all required fields in Page 1.`);
      return false;
    }
  }
  if (!/^\d{10}$/.test(formData.contact)) {
    Alert.alert("Validation Error", "Please enter a valid 10-digit contact number.");
    return false;
  }
  return true;
};

const validateStep2 = (formData) => {
  const required = ["age", "gender", "education", "experienceYear", "experienceField", "workStartTime", "workEndTime"];
  for (const field of required) {
    if (!String(formData[field] || "").trim()) {
      Alert.alert("Validation Error", `Please fill in all required fields in Page 2.`);
      return false;
    }
  }
  return true;
};

const validateStep3 = (formData) => {
  if (!String(formData.salaryOffering || "").trim()) {
    Alert.alert("Validation Error", "Please enter salary offering per month.");
    return false;
  }
  if (!formData.shopPhoto1) {
    Alert.alert("Validation Error", "Please upload at least one shop photo.");
    return false;
  }
  return true;
};

export default function AddJobGiver() {
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
          name: prev.name || user?.name || "",
          contact:
            prev.contact ||
            (accountContact ? sanitizePhoneInput(String(accountContact)) : ""),
        }));
      } catch (error) {
        console.error("[AddJobGiver] Could not prefill from account:", error);
      }
    };
    prefillFromAccount();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1(formData)) return;
    if (step === 2 && !validateStep2(formData)) return;
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
    if (!validateStep3(formData)) return;

    try {
      setIsSubmitting(true);
      // Backend hook-up can be added here later.
      const payload = {
        ...formData,
        workTimings: `${formData.workStartTime} - ${formData.workEndTime}`,
      };
      console.log("Job giver form submitted:", payload);

      Alert.alert("Success", "Job posting details saved successfully!", [
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
      Alert.alert("Error", error.message || "Failed to save job details.");
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

    if (step === 1) return <Step1ShopDetails {...stepProps} />;
    if (step === 2) return <Step2JobDetails {...stepProps} />;
    return <Step3ShopPhotos {...stepProps} />;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={ofs.screen}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f213d" />

      <OwnerFormHeader title="Job Giver" step={step} maxSteps={MAX_STEPS} dark={dark} />

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
