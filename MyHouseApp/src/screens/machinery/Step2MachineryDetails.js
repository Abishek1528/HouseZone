import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getOwnerFormStyles } from '../../styles/ownerFormStyles';
import OwnerFormCard from '../../shared/components/OwnerFormCard';
import OptionSelectField from '../../shared/components/OptionSelectField';



const PricingForm = ({ chargePerDay, chargePerKm, waitingChargePerHour, waitingChargePerNight, fixed, onChange, ofs }) => {
  return (
    <View>
      <Text style={ofs.label}>Charge per day</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={chargePerDay ?? ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(v) => onChange("chargePerDay", v)}
      />

      <Text style={ofs.label}>Charge per km</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={chargePerKm ?? ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(v) => onChange("chargePerKm", v)}
      />

      <Text style={ofs.label}>Waiting charge per hour</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={waitingChargePerHour ?? ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(v) => onChange("waitingChargePerHour", v)}
      />

      <Text style={ofs.label}>Waiting charge per night</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={waitingChargePerNight ?? ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(v) => onChange("waitingChargePerNight", v)}
      />

      <Text style={ofs.label}>Fixed</Text>
      <View style={ofs.radioRow}>
        <TouchableOpacity onPress={() => onChange("fixed", "yes")}>
          <Text style={fixed === 'yes' ? [ofs.radioActive, ofs.radioTextActive] : [ofs.radio, ofs.radioText]}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChange("fixed", "no")}>
          <Text style={fixed === 'no' ? [ofs.radioActive, ofs.radioTextActive] : [ofs.radio, ofs.radioText]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const Step2MachineryDetails = ({ formData, handleInputChange, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);
  // Initialize machinery array if not present
  const machinery = formData.machinery || [{ id: 1, type: "", name: "", model: "" }];
  
  // Get images from formData
  const images = formData.images || [];
  
  // Function to add a new machinery
  const addMachinery = () => {
    const newMachinery = {
      id: Date.now(),
      type: "",
      name: "",
      model: ""
    };
    const updatedMachinery = [...machinery, newMachinery];
    handleInputChange("machinery", updatedMachinery);
  };

  // Function to update a specific machinery
  const updateMachinery = (id, field, value) => {
    const updatedMachinery = machinery.map(mach => {
      if (mach.id === id) {
        return { ...mach, [field]: value };
      }
      return mach;
    });
    handleInputChange("machinery", updatedMachinery);
  };

  // Function to remove a machinery
  const removeMachinery = (id) => {
    if (machinery.length > 1) {
      const updatedMachinery = machinery.filter(mach => mach.id !== id);
      handleInputChange("machinery", updatedMachinery);
    }
  };
  
  // Ask permission for image picker
  const requestPermission = async (type) => {
    let result =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!result.granted) {
      Alert.alert(
        "Permission Denied",
        `Please enable ${type} access in settings.`
      );
      return false;
    }
    return true;
  };

  // Open camera or gallery
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
        const assets = Array.isArray(result.assets) ? result.assets : (result.uri ? [{ uri: result.uri }] : []);
        const newImages = assets.map(asset => asset?.uri ?? asset).filter(Boolean);
        const updatedImages = [...images, ...newImages].slice(0, 7); // Limit to 7 images
        handleInputChange('images', updatedImages);
      }
    } catch (err) {
      console.error('Image picker error:', err);
      Alert.alert('Error', 'Failed to pick image: ' + (err.message || 'Unknown'));
    }
  };
  
  // Remove image at specific index
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    handleInputChange('images', updatedImages);
  };

  // Define options
  const machineryTypeOptions = [
    { label: "Excavator", value: "excavator" },
    { label: "Bulldozer", value: "bulldozer" },
    { label: "Crane", value: "crane" },
    { label: "Loader", value: "loader" },
    { label: "Tractor", value: "tractor" },
    { label: "Generator", value: "generator" }
  ];

  return (
    <OwnerFormCard
      title="Machinery Details"
      subtitle="Equipment, pricing and photos"
      colors={colors}
      dark={dark}
    >
        {machinery.map((mach, index) => (
          <View key={mach.id} style={ofs.itemCard}>
            <Text style={ofs.itemCardTitle}>Machinery {index + 1}</Text>
            
            <OptionSelectField
              label="Machinery Type *"
              options={machineryTypeOptions}
              selectedValue={mach.type || ""}
              onSelect={(value) => updateMachinery(mach.id, "type", value)}
              colors={colors}
            />

            {/* Machinery Name */}
            <Text style={ofs.label}>Machinery Name *</Text>
            <TextInput
              style={ofs.input}
              value={mach.name || ""}
              onChangeText={(value) => updateMachinery(mach.id, "name", value)}
              placeholder="Enter machinery name"
              placeholderTextColor={ofs.colors.placeholder}
            />

            <Text style={ofs.label}>Machinery Model *</Text>
            <TextInput
              style={ofs.input}
              value={mach.model || ""}
              onChangeText={(value) => updateMachinery(mach.id, "model", value)}
              placeholder="Enter machinery model"
              placeholderTextColor={ofs.colors.placeholder}
            />

            <View style={ofs.pricingCard}>
              <Text style={ofs.pricingHeading}>Pricing Details</Text>
              <PricingForm
                chargePerDay={formData.chargePerDay}
                chargePerKm={formData.chargePerKm}
                waitingChargePerHour={formData.waitingChargePerHour}
                waitingChargePerNight={formData.waitingChargePerNight}
                fixed={formData.fixed || 'no'}
                onChange={(key, value) => handleInputChange(key, value)}
                ofs={ofs}
              />
            </View>

            {machinery.length > 1 && (
              <TouchableOpacity style={ofs.removeItemButton} onPress={() => removeMachinery(mach.id)}>
                <Text style={ofs.removeItemButtonText}>Remove Machinery</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        
        <Text style={ofs.sectionBlockTitle}>Machinery Images</Text>
        <Text style={[ofs.subtitle, { textAlign: "left", marginBottom: 12 }]}>
          Upload minimum 4 and maximum 7 images of your machinery.
        </Text>

        <View style={ofs.imageActionsRow}>
          <TouchableOpacity style={ofs.buttonPrimary} onPress={() => pickImage("camera")} disabled={images.length >= 7}>
            <Text style={ofs.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ofs.buttonPrimary} onPress={() => pickImage("gallery")} disabled={images.length >= 7}>
            <Text style={ofs.buttonText}>Choose Images</Text>
          </TouchableOpacity>
        </View>

        <View style={ofs.imageGrid}>
          {images.map((uri, index) => (
            <View key={index} style={ofs.imageThumbWrap}>
              <Image source={{ uri }} style={ofs.imageThumb} />
              <TouchableOpacity style={ofs.imageRemoveBtn} onPress={() => removeImage(index)}>
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

        <TouchableOpacity style={ofs.addItemButton} onPress={addMachinery}>
          <Text style={ofs.addItemButtonText}>Add Another Machinery</Text>
        </TouchableOpacity>
      </OwnerFormCard>
  );
};

export default Step2MachineryDetails;
