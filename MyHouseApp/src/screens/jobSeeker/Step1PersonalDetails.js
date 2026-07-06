import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import { sanitizePhoneInput } from "../../shared/utils/phoneInput";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const Step1PersonalDetails = ({ formData, handleInputChange, errors, onBlur, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);

  const requestPermission = async (type) => {
    const result =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!result.granted) {
      Alert.alert("Permission Denied", `Please enable ${type} access in settings.`);
      return false;
    }
    return true;
  };

  const pickImage = async (fieldKey, source) => {
    const allowed = await requestPermission(source);
    if (!allowed) return;

    try {
      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

      const isCanceled = result?.canceled ?? result?.cancelled ?? true;
      if (!isCanceled) {
        const uri = result.assets?.[0]?.uri ?? result.uri;
        if (uri) handleInputChange(fieldKey, uri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  return (
    <OwnerFormCard
      title="Personal Details"
      subtitle="Your basic personal information"
      colors={colors}
      dark={dark}
    >
      <OwnerFormField
        label="Full Name *"
        value={formData.fullName}
        onChangeText={(value) => handleInputChange("fullName", value)}
        colors={colors}
        dark={dark}
      />
      <OwnerFormField
        label="Mobile Number *"
        value={formData.mobileNumber}
        onChangeText={(value) => handleInputChange("mobileNumber", sanitizePhoneInput(value))}
        onBlur={() => onBlur("mobileNumber", formData.mobileNumber)}
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.mobileNumber}
        colors={colors}
        dark={dark}
      />
      <OwnerFormField
        label="Age *"
        value={formData.age}
        onChangeText={(value) => handleInputChange("age", value.replace(/\D/g, "").slice(0, 3))}
        keyboardType="numeric"
        maxLength={3}
        colors={colors}
        dark={dark}
      />
      <OptionSelectField
        label="Gender *"
        options={genderOptions}
        selectedValue={formData.gender || ""}
        onSelect={(value) => handleInputChange("gender", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OwnerFormField
        label="Aadhar Number"
        value={formData.aadharNumber}
        onChangeText={(value) => handleInputChange("aadharNumber", value.replace(/\D/g, "").slice(0, 12))}
        keyboardType="numeric"
        maxLength={12}
        colors={colors}
        dark={dark}
      />
      <View style={{ marginBottom: 20, marginTop: 10 }}>
        <Text style={ofs.sectionBlockTitle}>Profile Picture</Text>
        {formData.profilePicture ? (
          <View style={ofs.imageThumbWrap}>
            <Image source={{ uri: formData.profilePicture }} style={[ofs.imageThumb, { width: "100%", height: 180 }]} />
            <TouchableOpacity
              style={ofs.imageRemoveBtn}
              onPress={() => handleInputChange("profilePicture", "")}
            >
              <Text style={ofs.imageRemoveText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={ofs.imageActionsRow}>
            <TouchableOpacity
              style={ofs.buttonPrimary}
              onPress={() => pickImage("profilePicture", "camera")}
            >
              <Text style={ofs.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ofs.buttonPrimary}
              onPress={() => pickImage("profilePicture", "gallery")}
            >
              <Text style={ofs.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </OwnerFormCard>
  );
};

export default Step1PersonalDetails;
