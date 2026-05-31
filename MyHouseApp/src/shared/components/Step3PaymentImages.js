import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import OwnerFormCard from "./OwnerFormCard";
import OwnerFormField from "./OwnerFormField";

const Step3PaymentImages = ({
  formData,
  handleInputChange,
  handleImageSelect,
  handleRemoveImage,
  colors,
  dark,
}) => {
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

  const pickImage = async (source) => {
    const allowed = await requestPermission(source);
    if (!allowed) return;

    let result;

    try {
      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsMultipleSelection: true,
        });
      }

      const isCanceled = result?.canceled ?? result?.cancelled ?? true;
      if (!isCanceled) {
        const assets = Array.isArray(result.assets)
          ? result.assets
          : result.uri
            ? [{ uri: result.uri }]
            : [];
        assets.forEach((img) => {
          const uri = img?.uri ?? img;
          if (uri) handleImageSelect(uri);
        });
      }
    } catch (err) {
      console.error("Image picker error in Step3PaymentImages:", {
        source,
        message: err?.message || err,
      });
      Alert.alert("Error", "Failed to pick image: " + (err.message || "Unknown"));
    }
  };

  const images = Array.isArray(formData?.images) ? formData.images : [];

  const hasLeaseAmount =
    formData.leaseAmount &&
    !isNaN(parseFloat(formData.leaseAmount)) &&
    parseFloat(formData.leaseAmount) > 0;
  const hasAdvanceAmount =
    formData.advanceAmount &&
    !isNaN(parseFloat(formData.advanceAmount)) &&
    parseFloat(formData.advanceAmount) > 0;
  const hasRentAmount =
    formData.rentAmount &&
    !isNaN(parseFloat(formData.rentAmount)) &&
    parseFloat(formData.rentAmount) > 0;

  const bothAdvanceAndRentFilled = hasAdvanceAmount && hasRentAmount;
  const advanceAndRentDisabled = hasLeaseAmount;
  const leaseDisabled = bothAdvanceAndRentFilled;

  return (
    <OwnerFormCard
      title="Payment Details"
      subtitle="Pricing and property photos"
      colors={colors}
      dark={dark}
    >
        <View style={ofs.infoBox}>
          <Text style={ofs.infoTitle}>Choose Payment Option</Text>
          <Text style={ofs.infoText}>
            <Text style={{ fontWeight: "bold" }}>Option 1:</Text> Fill Lease Amount (Advance & Rent will be disabled)
          </Text>
          <Text style={[ofs.infoText, { marginTop: 6 }]}>
            <Text style={{ fontWeight: "bold" }}>Option 2:</Text> Fill Advance Amount & Monthly Rent (Lease will be disabled)
          </Text>
        </View>

        <OwnerFormField
          label={`Advance Amount (₹) ${advanceAndRentDisabled ? "(Disabled)" : "*"}`}
          placeholder="Advance Amount"
          value={formData.advanceAmount}
          onChangeText={(value) => {
            if (!advanceAndRentDisabled) handleInputChange("advanceAmount", value);
          }}
          keyboardType="numeric"
          editable={!advanceAndRentDisabled}
          colors={colors}
          dark={dark}
        />

        <OwnerFormField
          label={`Monthly Rent (₹) ${advanceAndRentDisabled ? "(Disabled)" : "*"}`}
          placeholder="Monthly Rent"
          value={formData.rentAmount}
          onChangeText={(value) => {
            if (!advanceAndRentDisabled) handleInputChange("rentAmount", value);
          }}
          keyboardType="numeric"
          editable={!advanceAndRentDisabled}
          colors={colors}
          dark={dark}
        />

        <OwnerFormField
          label={`Lease Amount (₹) ${leaseDisabled ? "(Disabled)" : ""}`}
          placeholder="Lease Amount"
          value={formData.leaseAmount}
          onChangeText={(value) => {
            if (!leaseDisabled) handleInputChange("leaseAmount", value);
          }}
          keyboardType="numeric"
          editable={!leaseDisabled}
          colors={colors}
          dark={dark}
        />

        <View style={ofs.divider} />

        <Text style={ofs.sectionBlockTitle}>Property Images</Text>
        <Text style={[ofs.subtitle, { textAlign: "left", marginBottom: 12 }]}>
          Upload minimum 4 and maximum 7 images of your property.
        </Text>

        <View style={ofs.imageActionsRow}>
          <TouchableOpacity
            style={ofs.buttonPrimary}
            onPress={() => pickImage("camera")}
            disabled={images.length >= 7}
          >
            <Text style={ofs.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ofs.buttonPrimary}
            onPress={() => pickImage("gallery")}
            disabled={images.length >= 7}
          >
            <Text style={ofs.buttonText}>Choose Images</Text>
          </TouchableOpacity>
        </View>

        <View style={ofs.imageGrid}>
          {images.map((uri, index) => (
            <View key={index} style={ofs.imageThumbWrap}>
              <Image source={{ uri }} style={ofs.imageThumb} />
              <TouchableOpacity
                style={ofs.imageRemoveBtn}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={ofs.imageRemoveText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {images.length < 7 && (
            <View style={ofs.imageThumbWrap}>
              <TouchableOpacity style={ofs.imageAddBox} onPress={() => pickImage("gallery")}>
                <Text style={ofs.imageAddPlus}>+</Text>
                <Text style={ofs.imageAddLabel}>Add Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={ofs.imageCount}>{images.length} / 7 images uploaded</Text>
    </OwnerFormCard>
  );
};

export default Step3PaymentImages;
