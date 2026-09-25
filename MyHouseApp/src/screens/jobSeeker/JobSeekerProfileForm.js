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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import Footer from "../../components/Footer";
import OwnerFormHeader from "../../shared/components/OwnerFormHeader";
import { useTheme } from "../../context/ThemeContext";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import { sanitizePhoneInput } from "../../shared/utils/phoneInput";
import { saveJobSeekerProfile, getJobSeekerProfile } from "./logic/api";

const MAX_STEPS = 2;

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const ageOptions = [
  { label: "Any", value: "Any" },
  { label: "18-30", value: "18-30" },
  { label: "30-50", value: "30-50" },
  { label: "50-60", value: "50-60" },
];

const educationOptions = [
  { label: "10th/12th", value: "10th/12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
  { label: "Diploma", value: "diploma" },
];

const experienceStatusOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

const experienceYearOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "1-2 Years", value: "1-2" },
  { label: "2-4 Years", value: "2-4" },
  { label: "4+ Years", value: "4+" },
];

const DEFAULT_EXPERIENCE_FIELD_OPTIONS = [
  { label: "Manager", value: "Manager" },
  { label: "Cashier", value: "Cashier" },
  { label: "Salesperson", value: "Salesperson" },
  { label: "Accountant", value: "Accountant" },
  { label: "Supervisor", value: "Supervisor" },
  { label: "Helper", value: "Helper" },
];


const canJoinImmediatelyOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const initialProfileData = {
  signupId: null,
  name: "",
  age: "",
  gender: "",
  street: "",
  area: "",
  city: "",
  aadhar: "",
  phoneNumber: "",
  education: "",
  experienceStatus: "",
  experienceYears: "",
  experienceField: "",
  canJoinImmediately: "",
};

const validateStep1 = (data, errors, setErrors) => {
  const newErrors = { ...(errors || {}) };
  let ok = true;

  if (!String(data.name || "").trim()) {
    newErrors.name = "Full name is required";
    ok = false;
  } else {
    delete newErrors.name;
  }

  if (!String(data.age || "").trim()) {
    newErrors.age = "Please select an age range";
    ok = false;
  } else {
    delete newErrors.age;
  }

  if (!String(data.gender || "").trim()) {
    newErrors.gender = "Please select gender";
    ok = false;
  } else {
    delete newErrors.gender;
  }

  if (!String(data.city || "").trim()) {
    newErrors.city = "City/Town is required";
    ok = false;
  } else {
    delete newErrors.city;
  }

  if (data.aadhar && String(data.aadhar).length > 0 && String(data.aadhar).length !== 12) {
    newErrors.aadhar = "Aadhar number must be exactly 12 digits";
    ok = false;
  } else if (data.aadhar && !/^\d{12}$/.test(String(data.aadhar))) {
    newErrors.aadhar = "Aadhar number must be exactly 12 digits";
    ok = false;
  } else {
    delete newErrors.aadhar;
  }

  if (data.phoneNumber && !/^\d{10}$/.test(String(data.phoneNumber))) {
    newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    ok = false;
  } else if (!data.phoneNumber) {
    newErrors.phoneNumber = "Phone number is required";
    ok = false;
  } else {
    delete newErrors.phoneNumber;
  }

  if (setErrors) setErrors(newErrors);
  if (!ok) {
    Alert.alert("Validation Error", "Please correct the highlighted fields to proceed.");
  }
  return ok;
};

const validateStep2 = (data, errors, setErrors) => {
  const newErrors = { ...(errors || {}) };
  let ok = true;

  if (!String(data.education || "").trim()) {
    newErrors.education = "Education qualification is required";
    ok = false;
  } else {
    delete newErrors.education;
  }

  if (!String(data.experienceStatus || "").trim()) {
    newErrors.experienceStatus = "Please select experience status";
    ok = false;
  } else {
    delete newErrors.experienceStatus;
  }

  if (data.experienceStatus === "experienced") {
    if (!String(data.experienceYears || "").trim()) {
      newErrors.experienceYears = "Please select experience years";
      ok = false;
    } else {
      delete newErrors.experienceYears;
    }
    if (!String(data.experienceField || "").trim()) {
      newErrors.experienceField = "Please enter your experience field";
      ok = false;
    } else {
      delete newErrors.experienceField;
    }
  }

  if (!String(data.canJoinImmediately || "").trim()) {
    newErrors.canJoinImmediately = "Please select an option";
    ok = false;
  } else {
    delete newErrors.canJoinImmediately;
  }

  if (setErrors) setErrors(newErrors);
  if (!ok) {
    Alert.alert("Validation Error", "Please correct the highlighted fields to submit.");
  }
  return ok;
};

export default function JobSeekerProfileForm() {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const ofs = getOwnerFormStyles(colors, dark);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialProfileData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [experienceFieldOptions, setExperienceFieldOptions] = useState(DEFAULT_EXPERIENCE_FIELD_OPTIONS);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${API_BASE_URL}/job-options/titles`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map(item => ({
              label: item.title,
              value: item.title
            }));
            setExperienceFieldOptions(formatted);
          }
        }
      } catch (err) {
        console.warn("[JobSeekerProfileForm] Using default experience field options:", err);
      }
    };
    fetchTitles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {

      const loadProfile = async () => {
        try {
          const userDetailsRaw = await AsyncStorage.getItem("userDetails");
          const userDetails = userDetailsRaw ? JSON.parse(userDetailsRaw) : null;
          const signupId = userDetails?.id || userDetails?.signupId;

          let prefilledName = "";

          const query = {};
          if (signupId) query.signupId = signupId;
          try {
            const loaded = await getJobSeekerProfile(query);
            if (loaded && typeof loaded === "object" && loaded.name) {
              prefilledName = loaded.name;
            }
          } catch (_err) {
            // ignore
          }

          if (!prefilledName) {
            const stored = await AsyncStorage.getItem("jobSeekerProfile");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.name) {
                prefilledName = parsed.name;
              }
            }
          }

          let prefilledPhone = "";
          if (userDetails?.contact || userDetails?.contact_number) {
            prefilledPhone = sanitizePhoneInput(String(userDetails.contact || userDetails.contact_number));
          }

          setCurrentStep(1);
          setFormData({
            ...initialProfileData,
            name: prefilledName,
            phoneNumber: prefilledPhone,
            signupId: signupId || null,
          });
        } catch (err) {
          console.error("[JobSeekerProfileForm] Failed to load profile:", err);
        }
      };
      loadProfile();
    }, [])
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors && errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNext = () => {
    if (!validateStep1(formData, errors, setErrors)) return;
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2(formData, errors, setErrors)) return;
    try {
      setIsSaving(true);

      const submitData = { ...formData };
      if (formData.experienceStatus === "fresher") {
        submitData.experienceYears = "";
        submitData.experienceField = "";
      }

      let saved = false;
      try {
        const response = await saveJobSeekerProfile(submitData);
        if (response?.profileId) {
          await AsyncStorage.setItem("jobSeekerProfileId", String(response.profileId));
          saved = true;
        }
      } catch (saveErr) {
        console.warn("[JobSeekerProfileForm] Backend save failed, using fallback AsyncStorage:", saveErr);
      }

      await AsyncStorage.setItem("jobSeekerProfile", JSON.stringify(submitData));

      if (saved) {
        Alert.alert("Success", "Your profile has been saved to the database!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(
          "Saved Locally",
          "Profile was saved on your device. Backend save failed — please check your server connection.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("[JobSeekerProfileForm] Save error:", error);
      Alert.alert("Error", "Failed to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStep1Personal = () => (
    <OwnerFormCard
      title="Personal Details"
      subtitle="Page 1 of 2 — Name, contact and location"
      colors={ofs.themeColors}
      dark={dark}
    >
      <OwnerFormField
        label="Full Name *"
        value={formData.name}
        onChangeText={(value) => handleInputChange("name", value)}
        colors={ofs.themeColors}
        dark={dark}
        error={errors.name}
      />
      <OptionSelectField
        label="Age *"
        options={ageOptions}
        selectedValue={formData.age || ""}
        onSelect={(value) => handleInputChange("age", value)}
        colors={ofs.themeColors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Gender *"
        options={genderOptions}
        selectedValue={formData.gender || ""}
        onSelect={(value) => handleInputChange("gender", value)}
        colors={ofs.themeColors}
        dark={dark}
        collapsible
      />
      <OwnerFormField
        label="Street"
        value={formData.street}
        onChangeText={(value) => handleInputChange("street", value)}
        placeholder="e.g., Main Road, 2nd Lane, Gandhi Street"
        colors={ofs.themeColors}
        dark={dark}
      />
      <OwnerFormField
        label="Area"
        value={formData.area}
        onChangeText={(value) => handleInputChange("area", value)}
        placeholder="e.g., Local Area / Colony / Street"
        colors={ofs.themeColors}
        dark={dark}
      />
      <OwnerFormField
        label="City/Town *"
        value={formData.city}
        onChangeText={(value) => handleInputChange("city", value)}
        placeholder="e.g., Chennai / Coimbatore"
        colors={ofs.themeColors}
        dark={dark}
        error={errors.city}
      />
      <OwnerFormField
        label="Aadhar Number"
        value={formData.aadhar}
        onChangeText={(value) => {
          const digits = value.replace(/\D/g, "").slice(0, 12);
          handleInputChange("aadhar", digits);
        }}
        keyboardType="numeric"
        placeholder="12-digit Aadhar number"
        colors={ofs.themeColors}
        dark={dark}
        error={errors.aadhar}
      />
      <OwnerFormField
        label="Phone Number *"
        value={formData.phoneNumber}
        onChangeText={(value) => {
          const digits = sanitizePhoneInput(value).slice(0, 10);
          handleInputChange("phoneNumber", digits);
        }}
        keyboardType="numeric"
        placeholder="10-digit mobile number"
        colors={ofs.themeColors}
        dark={dark}
        error={errors.phoneNumber}
      />
    </OwnerFormCard>
  );

  const renderStep2Education = () => (
    <OwnerFormCard
      title="Educational Qualification & Experience"
      subtitle="Page 2 of 2 — Education and work background"
      colors={ofs.themeColors}
      dark={dark}
    >
      <OptionSelectField
        label="Education Qualification *"
        options={educationOptions}
        selectedValue={formData.education || ""}
        onSelect={(value) => handleInputChange("education", value)}
        colors={ofs.themeColors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Experience Status *"
        options={experienceStatusOptions}
        selectedValue={formData.experienceStatus || ""}
        onSelect={(value) => handleInputChange("experienceStatus", value)}
        colors={ofs.themeColors}
        dark={dark}
        collapsible
      />
      {formData.experienceStatus === "experienced" && (
        <>
          <OptionSelectField
            label="Experience Years *"
            options={experienceYearOptions}
            selectedValue={formData.experienceYears || ""}
            onSelect={(value) => handleInputChange("experienceYears", value)}
            colors={ofs.themeColors}
            dark={dark}
            collapsible
          />
          <OptionSelectField
            label="Experience Field *"
            options={experienceFieldOptions}
            selectedValue={formData.experienceField || ""}
            onSelect={(value) => handleInputChange("experienceField", value)}
            colors={ofs.themeColors}
            dark={dark}
            collapsible
          />
        </>
      )}
      <OptionSelectField
        label="Can Join Immediately *"
        options={canJoinImmediatelyOptions}
        selectedValue={formData.canJoinImmediately || ""}
        onSelect={(value) => handleInputChange("canJoinImmediately", value)}
        colors={ofs.themeColors}
        dark={dark}
        collapsible
      />
    </OwnerFormCard>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={ofs.screen}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f213d" />

      <OwnerFormHeader title="Add My Profile" step={currentStep} maxSteps={MAX_STEPS} dark={dark} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={ofs.scrollContent}
      >
        <View style={ofs.formCenterWrap}>
          {currentStep === 1 && renderStep1Personal()}
          {currentStep === 2 && renderStep2Education()}

          <View style={ofs.formActionsRow}>
            <TouchableOpacity
              style={[ofs.formActionBtn, ofs.formActionBtnOutline]}
              onPress={handleBack}
              disabled={isSaving}
            >
              <Text style={ofs.formActionBtnOutlineText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[ofs.formActionBtn, ofs.formActionBtnPrimary]}
              onPress={currentStep === 1 ? handleNext : handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={ofs.formActionBtnText}>
                  {currentStep === 1 ? "Next" : "Save Profile"}
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
