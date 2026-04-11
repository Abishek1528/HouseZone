import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import categoryContentStyles from '../../styles/categoryContentStyles';



const PricingForm = ({ pricingData, onUpdate, prefix, colors }) => {
  const fixed = pricingData[`${prefix}_fixed`] ? 'yes' : 'no';

  const handleChange = (field, value) => {
    onUpdate(`${prefix}_${field}`, value);
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors?.text || '#000' }]}>Charge per day</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
        keyboardType="numeric"
        value={pricingData[`${prefix}_charge_per_day`] || ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(text) => handleChange('charge_per_day', text)}
      />

      <Text style={[styles.label, { color: colors?.text || '#000' }]}>Charge per km</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
        keyboardType="numeric"
        value={pricingData[`${prefix}_charge_per_km`] || ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(text) => handleChange('charge_per_km', text)}
      />

      <Text style={[styles.label, { color: colors?.text || '#000' }]}>Waiting charge per hour</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
        keyboardType="numeric"
        value={pricingData[`${prefix}_waiting_charge_per_hour`] || ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(text) => handleChange('waiting_charge_per_hour', text)}
      />

      <Text style={[styles.label, { color: colors?.text || '#000' }]}>Waiting charge per night</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
        keyboardType="numeric"
        value={pricingData[`${prefix}_waiting_charge_per_night`] || ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(text) => handleChange('waiting_charge_per_night', text)}
      />

      <Text style={[styles.label, { color: colors?.text || '#000' }]}>Fixed</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => onUpdate(`${prefix}_fixed`, true)}>
          <Text style={fixed === 'yes' ? [styles.activeRadio, { backgroundColor: colors?.primary || '#4A90E2', color: '#fff' }] : [styles.radio, { color: colors?.text || '#333', borderColor: colors?.border || '#aaa' }]}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onUpdate(`${prefix}_fixed`, false)}>
          <Text style={fixed === 'no' ? [styles.activeRadio, { backgroundColor: colors?.primary || '#4A90E2', color: '#fff' }] : [styles.radio, { color: colors?.text || '#333', borderColor: colors?.border || '#aaa' }]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const Step2VehiclesDetails = ({ formData, handleInputChange, colors }) => {
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
    { label: "Select Vehicle Type", value: "" },
    { label: "Car", value: "car" },
    { label: "Van", value: "van" },
    { label: "Bus", value: "bus" }
  ];

  const seatCapacityOptions = [
    { label: "Select Seat Capacity", value: "" },
    { label: "4", value: "4" },
    { label: "7", value: "7" },
    { label: "9", value: "9" },
    { label: "25", value: "25" },
    { label: "55", value: "55" }
  ];

  const fuelTypeOptions = [
    { label: "Select Fuel Type", value: "" },
    { label: "Electric", value: "electric" },
    { label: "Petrol", value: "petrol" },
    { label: "Diesel", value: "diesel" }
  ];

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Vehicle Details</Text>

        {vehicles.map((vehicle, index) => (
          <View key={vehicle.id} style={[styles.vehicleContainer, { backgroundColor: colors?.card || '#f9f9f9', borderColor: colors?.border || '#ddd' }]}>
            <Text style={[styles.vehicleTitle, { color: colors?.text || '#333' }]}>Vehicle {index + 1}</Text>

            {/* Vehicle Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Vehicle Type *</Text>
              <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
                <Picker
                  selectedValue={vehicle.type || ""}
                  style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                  dropdownIconColor={colors?.text || '#000'}
                  onValueChange={(value) => updateVehicle(vehicle.id, "type", value)}
                >
                  {vehicleTypeOptions.map((option, idx) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={idx === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Vehicle Name */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Vehicle Name *</Text>
              <TextInput
                style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                value={vehicle.name || ""}
                onChangeText={(value) => updateVehicle(vehicle.id, "name", value)}
                placeholder="Enter vehicle name"
                placeholderTextColor={colors?.placeholder || "#999999"}
              />
            </View>

            {/* Vehicle Model */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Vehicle Model *</Text>
              <TextInput
                style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                value={vehicle.model || ""}
                onChangeText={(value) => updateVehicle(vehicle.id, "model", value)}
                placeholder="Enter vehicle model"
                placeholderTextColor={colors?.placeholder || "#999999"}
              />
            </View>

            {/* Seat Capacity Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Seat Capacity *</Text>
              <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
                <Picker
                  selectedValue={vehicle.seatCapacity || ""}
                  style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                  dropdownIconColor={colors?.text || '#000'}
                  onValueChange={(value) => updateVehicle(vehicle.id, "seatCapacity", value)}
                >
                  {seatCapacityOptions.map((option, idx) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={idx === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Fuel Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Fuel Type *</Text>
              <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
                <Picker
                  selectedValue={vehicle.fuelType || ""}
                  style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                  dropdownIconColor={colors?.text || '#000'}
                  onValueChange={(value) => updateVehicle(vehicle.id, "fuelType", value)}
                >
                  {fuelTypeOptions.map((option, idx) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={idx === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Horizontal Line Below Fuel Type */}
            <View style={styles.mainContainer}>

              <View style={styles.column}>
                <Text style={[styles.heading, { color: colors?.text || '#000' }]}>AC</Text>
                <PricingForm
                  pricingData={vehicle}
                  onUpdate={(field, value) => updateVehicle(vehicle.id, field, value)}
                  prefix="ac"
                  colors={colors}
                />
              </View>

              <View style={[styles.verticalLine, { backgroundColor: colors?.primary || '#4A90E2' }]} />

              <View style={styles.column}>
                <Text style={[styles.heading, { color: colors?.text || '#000' }]}>Non AC</Text>
                <PricingForm
                  pricingData={vehicle}
                  onUpdate={(field, value) => updateVehicle(vehicle.id, field, value)}
                  prefix="nonac"
                  colors={colors}
                />
              </View>

            </View>


            {/* Remove Vehicle Button */}
            {vehicles.length > 1 && (
              <View style={styles.removeButtonContainer}>
                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: colors?.secondary || '#FF6B6B' }]}
                  onPress={() => removeVehicle(vehicle.id)}
                >
                  <Text style={styles.removeButtonText}>Remove Vehicle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Image Upload Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Upload Vehicle Images</Text>
          <Text style={{ marginBottom: 15, fontSize: 14, color: colors?.subText || '#666' }}>
            Upload minimum 4 and maximum 7 images of your vehicles.
          </Text>

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginVertical: 20,
            }}
          >
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { backgroundColor: colors?.primary || '#4A90E2' }]}
              onPress={() => pickImage("camera")}
              disabled={images.length >= 7}
            >
              <Text style={categoryContentStyles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { backgroundColor: colors?.primary || '#4A90E2' }]}
              onPress={() => pickImage("gallery")}
              disabled={images.length >= 7}
            >
              <Text style={categoryContentStyles.buttonText}>Choose Images</Text>
            </TouchableOpacity>
          </View>

          {/* Show Images Grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {images.map((uri, index) => (
              <View key={index} style={{ width: "30%", marginBottom: 15 }}>
                <Image
                  source={{ uri }}
                  style={{ width: "100%", height: 100, borderRadius: 5 }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: colors?.secondary || "red",
                    padding: 5,
                    marginTop: 5,
                    borderRadius: 4,
                    alignItems: "center",
                  }}
                  onPress={() => removeImage(index)}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Image Box */}
            {images.length < 7 && (
              <View style={{ width: "30%", marginBottom: 10 }}>
                <TouchableOpacity
                  style={{
                    height: 100,
                    borderWidth: 1,
                    borderColor: colors?.border || "#aaa",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    backgroundColor: colors?.card || '#fff'
                  }}
                  onPress={() => pickImage("gallery")}
                >
                  <Text style={{ fontSize: 26, color: colors?.primary || "#4A90E2" }}>+</Text>
                  <Text style={{ fontSize: 12, color: colors?.subText || "#666" }}>Add Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={{ textAlign: "center", marginTop: 10, color: colors?.text || '#000' }}>
            {images.length} / 7 images uploaded
          </Text>
        </View>

        {/* Add More Vehicle Button - Moved to the end */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors?.primary || '#4A90E2' }]}
          onPress={addVehicle}
        >
          <Text style={styles.addButtonText}>Add Another Vehicle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  vehicleContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 25,
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  vehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
  },

  column: {
    flex: 1,
    padding: 10,
  },

  heading: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  verticalLine: {
    width: 1,
    backgroundColor: '#4A90E2',
  },

  label: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 'bold',   // ✅ bold
    color: '#000',
  },


  input: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    fontSize: 16,
    color: '#000'          // ✅ consistent readable size
  },


  radioContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 8,
  },

  radio: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
  },

  activeRadio: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#4A90E2',
    backgroundColor: '#EAF2FF',
    borderRadius: 4,
  },

  removeButtonContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Step2VehiclesDetails;