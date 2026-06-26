import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OwnerFormField from "../../shared/components/OwnerFormField";

const PHOTO_FIELDS = [
  { key: "shopPhoto1", label: "Shop Photo 1 *", required: true },
  { key: "shopPhoto2", label: "Shop Photo 2", required: false },
  { key: "shopPhoto3", label: "Shop Photo 3", required: false },
];

const Step3ShopPhotos = ({ formData, handleInputChange, colors, dark }) => {
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

  const renderPhotoSlot = ({ key, label, required }) => {
    const uri = formData[key];
    return (
      <View key={key} style={{ marginBottom: 20 }}>
        <Text style={ofs.sectionBlockTitle}>{label}</Text>
        {uri ? (
          <View style={ofs.imageThumbWrap}>
            <Image source={{ uri }} style={[ofs.imageThumb, { width: "100%", height: 180 }]} />
            <TouchableOpacity
              style={ofs.imageRemoveBtn}
              onPress={() => handleInputChange(key, "")}
            >
              <Text style={ofs.imageRemoveText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={ofs.imageActionsRow}>
            <TouchableOpacity
              style={ofs.buttonPrimary}
              onPress={() => pickImage(key, "camera")}
            >
              <Text style={ofs.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ofs.buttonPrimary}
              onPress={() => pickImage(key, "gallery")}
            >
              <Text style={ofs.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        )}
        {!uri && required ? (
          <Text style={[ofs.subtitle, { textAlign: "left", marginTop: 6 }]}>
            Shop photo is required so job seekers can recognize your shop.
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <OwnerFormCard
      title="Page 3"
      subtitle="Salary, skills & photos"
      colors={colors}
      dark={dark}
    >
      <OwnerFormField
        label="Salary Offering Per Month (₹) *"
        value={formData.salaryOffering}
        onChangeText={(value) => handleInputChange("salaryOffering", value.replace(/\D/g, ""))}
        keyboardType="numeric"
        colors={colors}
        dark={dark}
      />
      <OwnerFormField
        label="Other Skills"
        value={formData.otherSkills}
        onChangeText={(value) => handleInputChange("otherSkills", value)}
        placeholder="Any other skills required..."
        multiline
        colors={colors}
        dark={dark}
      />
      <Text style={[ofs.sectionBlockTitle, { marginTop: 10, marginBottom: 4 }]}>Photos of Shop</Text>
      {PHOTO_FIELDS.map(renderPhotoSlot)}
    </OwnerFormCard>
  );
};

export default Step3ShopPhotos;
