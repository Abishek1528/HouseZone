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



const PricingForm = ({ pricingData, onUpdate, prefix, ofs }) => {
  const fixed = pricingData[`${prefix}_fixed`] ? 'yes' : 'no';

  const handleChange = (field, value) => {
    onUpdate(`${prefix}_${field}`, value);
  };

  return (
    <View>
      <Text style={ofs.label}>Charge per day</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={pricingData[`${prefix}_charge_per_day`] || ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(text) => handleChange('charge_per_day', text)}
      />

      <Text style={ofs.label}>Charge per km</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={pricingData[`${prefix}_charge_per_km`] || ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(text) => handleChange('charge_per_km', text)}
      />

      <Text style={ofs.label}>Waiting charge per hour</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={pricingData[`${prefix}_waiting_charge_per_hour`] || ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(text) => handleChange('waiting_charge_per_hour', text)}
      />

      <Text style={ofs.label}>Waiting charge per night</Text>
      <TextInput
        style={ofs.input}
        keyboardType="numeric"
        value={pricingData[`${prefix}_waiting_charge_per_night`] || ""}
        placeholderTextColor={ofs.colors.placeholder}
        onChangeText={(text) => handleChange('waiting_charge_per_night', text)}
      />

      <Text style={ofs.label}>Fixed</Text>
      <View style={ofs.radioRow}>
        <TouchableOpacity onPress={() => onUpdate(`${prefix}_fixed`, true)}>
          <Text style={fixed === 'yes' ? [ofs.radioActive, ofs.radioTextActive] : [ofs.radio, ofs.radioText]}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onUpdate(`${prefix}_fixed`, false)}>
          <Text style={fixed === 'no' ? [ofs.radioActive, ofs.radioTextActive] : [ofs.radio, ofs.radioText]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const Step2VehiclesDetails = ({ formData, handleInputChange, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);
  // Initialize vehicles array if not present
  const vehicles = formData.vehicles || [{
    id: 1, type: "", name: "", model: "", seatCapacity: "", fuelType: "",
    ac_charge_per_day: "", ac_charge_per_km: "", ac_waiting_charge_per_hour: "", ac_waiting_charge_per_night: "", ac_fixed: false,
    nonac_charge_per_day: "", nonac_charge_per_km: "", nonac_waiting_charge_per_hour: "", nonac_waiting_charge_per_night: "", nonac_fixed: false
  }];

  // Get images from formData
  const images = formData.images || [];

  // Function to add a new vehicle
  const addVehicle = () => {
    const newVehicle = {
      id: Date.now(),
      type: "",
      name: "",
      model: "",
      seatCapacity: "",
      fuelType: "",
      ac_charge_per_day: "",
      ac_charge_per_km: "",
      ac_waiting_charge_per_hour: "",
      ac_waiting_charge_per_night: "",
      ac_fixed: false,
      nonac_charge_per_day: "",
      nonac_charge_per_km: "",
      nonac_waiting_charge_per_hour: "",
      nonac_waiting_charge_per_night: "",
      nonac_fixed: false
    };
    const updatedVehicles = [...vehicles, newVehicle];
    handleInputChange("vehicles", updatedVehicles);
  };
  // Function to update a specific vehicle
  const updateVehicle = (id, field, value) => {
    const updatedVehicles = vehicles.map(vehicle => {
      if (vehicle.id === id) {
        return { ...vehicle, [field]: value };
      }
      return vehicle;
    });
    handleInputChange("vehicles", updatedVehicles);
  };
  
  // Function to remove a vehicle
  const removeVehicle = (id) => {
    if (vehicles.length > 1) {
      const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== id);
      handleInputChange("vehicles", updatedVehicles);
    }
  };

  // Existing image picker logic...
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
  const vehicleTypeOptions = [
    { label: "Car", value: "car" },
    { label: "Van", value: "van" },
    { label: "Bus", value: "bus" }
  ];

  const seatCapacityOptions = [
    { label: "4", value: "4" },
    { label: "7", value: "7" },
    { label: "9", value: "9" },
    { label: "25", value: "25" },
    { label: "55", value: "55" }
  ];

  const fuelTypeOptions = [
    { label: "Electric", value: "electric" },
    { label: "Petrol", value: "petrol" },
    { label: "Diesel", value: "diesel" }
  ];

  return (
    <OwnerFormCard
      title="Vehicle Details"
      subtitle="Vehicles, pricing and photos"
      colors={colors}
      dark={dark}
    >
        {vehicles.map((vehicle, index) => (
          <View key={vehicle.id} style={ofs.itemCard}>
            <Text style={ofs.itemCardTitle}>Vehicle {index + 1}</Text>

            <OptionSelectField
              label="Vehicle Type *"
              options={vehicleTypeOptions}
              selectedValue={vehicle.type || ""}
              onSelect={(value) => updateVehicle(vehicle.id, "type", value)}
              colors={colors}
            />

            {/* Vehicle Name */}
            <Text style={ofs.label}>Vehicle Name *</Text>
            <TextInput
              style={ofs.input}
              value={vehicle.name || ""}
              onChangeText={(value) => updateVehicle(vehicle.id, "name", value)}
              placeholder="Enter vehicle name"
              placeholderTextColor={ofs.colors.placeholder}
            />

            <Text style={ofs.label}>Vehicle Model *</Text>
            <TextInput
              style={ofs.input}
              value={vehicle.model || ""}
              onChangeText={(value) => updateVehicle(vehicle.id, "model", value)}
              placeholder="Enter vehicle model"
              placeholderTextColor={ofs.colors.placeholder}
            />

            {/* Seat Capacity Dropdown */}
            <OptionSelectField
              label="Seat Capacity *"
              options={seatCapacityOptions}
              selectedValue={vehicle.seatCapacity || ""}
              onSelect={(value) => updateVehicle(vehicle.id, "seatCapacity", value)}
              colors={colors}
            />

            <OptionSelectField
              label="Fuel Type *"
              options={fuelTypeOptions}
              selectedValue={vehicle.fuelType || ""}
              onSelect={(value) => updateVehicle(vehicle.id, "fuelType", value)}
              colors={colors}
            />

            {/* Horizontal Line Below Fuel Type */}
            <View style={ofs.pricingCard}>
              <View style={ofs.twoColumn}>
                <View style={ofs.column}>
                  <Text style={ofs.columnHeading}>AC</Text>
                  <PricingForm
                    pricingData={vehicle}
                    onUpdate={(field, value) => updateVehicle(vehicle.id, field, value)}
                    prefix="ac"
                    ofs={ofs}
                  />
                </View>
                <View style={ofs.verticalDivider} />
                <View style={ofs.column}>
                  <Text style={ofs.columnHeading}>Non AC</Text>
                  <PricingForm
                    pricingData={vehicle}
                    onUpdate={(field, value) => updateVehicle(vehicle.id, field, value)}
                    prefix="nonac"
                    ofs={ofs}
                  />
                </View>
              </View>
            </View>

            {vehicles.length > 1 && (
              <TouchableOpacity style={ofs.removeItemButton} onPress={() => removeVehicle(vehicle.id)}>
                <Text style={ofs.removeItemButtonText}>Remove Vehicle</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Text style={ofs.sectionBlockTitle}>Vehicle Images</Text>
        <Text style={[ofs.subtitle, { textAlign: "left", marginBottom: 12 }]}>
          Upload minimum 4 and maximum 7 images of your vehicles.
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

        <TouchableOpacity style={ofs.addItemButton} onPress={addVehicle}>
          <Text style={ofs.addItemButtonText}>Add Another Vehicle</Text>
        </TouchableOpacity>
      </OwnerFormCard>
  );
};

export default Step2VehiclesDetails;