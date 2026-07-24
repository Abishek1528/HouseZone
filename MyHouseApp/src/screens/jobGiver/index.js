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
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import Footer from "../../components/Footer";
import OwnerFormHeader from "../../shared/components/OwnerFormHeader";
import { useTheme } from "../../context/ThemeContext";
import { sanitizePhoneInput } from "../../shared/utils/phoneInput";
import { initialFormData } from "./logic/mainLogic";
import { saveJobGiverStep1, saveJobGiverStep2, saveJobGiverStep3 } from "./logic/api";
import Step1ShopDetails from "./Step1ShopDetails";
import Step2JobDetails from "./Step2JobDetails";
import Step3ShopPhotos from "./Step3ShopPhotos";

const MAX_STEPS = 3;

const validateStep1 = (formData) => {
  const required = ["ownerName", "shopName", "shopType", "area", "city", "contact"];
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
  const required = ["jobTitle", "employmentType", "age", "gender", "education", "experienceYear", "experienceField", "workStartTime", "workEndTime"];
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
          ownerName: prev.ownerName || user?.name || "",
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

      // Step 1: Save personal info
      const step1Data = {
        ownerName: formData.ownerName,
        shopName: formData.shopName,
        shopType: formData.shopType,
        area: formData.area,
        city: formData.city,
        landmark: formData.landmark,
        contact: formData.contact,
      };
      const step1Response = await saveJobGiverStep1(step1Data);
      const jobGiverId = step1Response.jobGiverId;

      // Step 2: Save job details
      const step2Data = {
        jobGiverId: jobGiverId,
        jobTitle: formData.jobTitle,
        employmentType: formData.employmentType,
        age: formData.age,
        gender: formData.gender,
        education: formData.education,
        experienceYear: formData.experienceYear,
        experienceField: formData.experienceField,
        workingTimeStart: formData.workStartTime,
        workingTimeEnd: formData.workEndTime,
      };
      await saveJobGiverStep2(step2Data);

      // Step 3: Save salary, skills, and photos
      const step3Data = {
        jobGiverId: jobGiverId,
        salaryOffering: formData.salaryOffering,
        otherSkills: formData.otherSkills,
        shopPhoto1: formData.shopPhoto1,
        shopPhoto2: formData.shopPhoto2,
        shopPhoto3: formData.shopPhoto3,
      };
      await saveJobGiverStep3(step3Data);

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
      console.error("Error submitting job giver form:", error);
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
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={ofs.formActionBtnText}>
                  {step < MAX_STEPS ? "Next" : "Submit"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </KeyboardAvoidingView>
  );
}
