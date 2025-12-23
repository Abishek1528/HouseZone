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



const PricingForm = () => {
  const [fixed, setFixed] = React.useState('yes');

  return (
    <View>
      <Text style={styles.label}>Charge per day</Text>
      <TextInput style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Charge per km</Text>
      <TextInput style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Waiting charge per hour</Text>
      <TextInput style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Waiting charge per night</Text>
      <TextInput style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Fixed</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => setFixed('yes')}>
          <Text style={fixed === 'yes' ? styles.activeRadio : styles.radio}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFixed('no')}>
          <Text style={fixed === 'no' ? styles.activeRadio : styles.radio}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const Step2VehiclesDetails = ({ formData, handleInputChange }) => {
  // Initialize vehicles array if not present
  const vehicles = formData.vehicles || [{ id: 1, type: "", name: "", model: "", seatCapacity: "", fuelType: "" }];
  
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
      fuelType: ""
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

    if (!result.canceled) {
      // Add new images to existing images
      const newImages = result.assets.map(asset => asset.uri);
      const updatedImages = [...images, ...newImages].slice(0, 7); // Limit to 7 images
      handleInputChange('images', updatedImages);
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
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Vehicle Details</Text>
        
        {vehicles.map((vehicle, index) => (
          <View key={vehicle.id} style={styles.vehicleContainer}>
            <Text style={styles.vehicleTitle}>Vehicle {index + 1}</Text>
            
            {/* Vehicle Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Vehicle Type *</Text>
              <View style={categoryContentStyles.pickerContainer}>
                <Picker
                  selectedValue={vehicle.type || ""}
                  style={categoryContentStyles.picker}
                  onValueChange={(value) => updateVehicle(vehicle.id, "type", value)}
                >
                  {vehicleTypeOptions.map((option, index) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value} 
                      color={index === 0 ? '#999999' : '#000000'}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Vehicle Name */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Vehicle Name *</Text>
              <TextInput
                style={categoryContentStyles.input}
                value={vehicle.name || ""}
                onChangeText={(value) => updateVehicle(vehicle.id, "name", value)}
                placeholder="Enter vehicle name"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Vehicle Model */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Vehicle Model *</Text>
              <TextInput
                style={categoryContentStyles.input}
                value={vehicle.model || ""}
                onChangeText={(value) => updateVehicle(vehicle.id, "model", value)}
                placeholder="Enter vehicle model"
                placeholderTextColor="#999999"
              />
            </View>

            {/* Seat Capacity Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Seat Capacity *</Text>
              <View style={categoryContentStyles.pickerContainer}>
                <Picker
                  selectedValue={vehicle.seatCapacity || ""}
                  style={categoryContentStyles.picker}
                  onValueChange={(value) => updateVehicle(vehicle.id, "seatCapacity", value)}
                >
                  {seatCapacityOptions.map((option, index) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value} 
                      color={index === 0 ? '#999999' : '#000000'}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Fuel Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Fuel Type *</Text>
              <View style={categoryContentStyles.pickerContainer}>
                <Picker
                  selectedValue={vehicle.fuelType || ""}
                  style={categoryContentStyles.picker}
                  onValueChange={(value) => updateVehicle(vehicle.id, "fuelType", value)}
                >
                  {fuelTypeOptions.map((option, index) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value} 
                      color={index === 0 ? '#999999' : '#000000'}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Horizontal Line Below Fuel Type */}
            <View style={styles.mainContainer}>

  <View style={styles.column}>
    <Text style={styles.heading}>AC</Text>
    <PricingForm />
  </View>

  <View style={styles.verticalLine} />

  <View style={styles.column}>
    <Text style={styles.heading}>Non AC</Text>
    <PricingForm />
  </View>

</View>


            {/* Remove Vehicle Button */}
            {vehicles.length > 1 && (
              <View style={styles.removeButtonContainer}>
                <TouchableOpacity 
                  style={styles.removeButton}
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
          <Text style={categoryContentStyles.formTitle}>Upload Vehicle Images</Text>
          <Text style={{ marginBottom: 15, fontSize: 14, color: '#666' }}>
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
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
              onPress={() => pickImage("camera")}
              disabled={images.length >= 7}
            >
              <Text style={categoryContentStyles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
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
                    backgroundColor: "red",
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
                    borderColor: "#aaa",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                  onPress={() => pickImage("gallery")}
                >
                  <Text style={{ fontSize: 26, color: "#4A90E2" }}>+</Text>
                  <Text style={{ fontSize: 12, color: "#666" }}>Add Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={{ textAlign: "center", marginTop: 10 }}>
            {images.length} / 7 images uploaded
          </Text>
        </View>
        
        {/* Add More Vehicle Button - Moved to the end */}
        <TouchableOpacity 
          style={styles.addButton}
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
  color:'#000'          // ✅ consistent readable size
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