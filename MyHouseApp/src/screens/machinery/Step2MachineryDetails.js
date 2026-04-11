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



const PricingForm = ({ chargePerDay, chargePerKm, waitingChargePerHour, waitingChargePerNight, fixed, onChange, colors }) => {
  return (
    <View>
      <Text style={[styles.label, { color: colors?.text || '#333' }]}>Charge per day</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#ccc' }]}
        keyboardType="numeric"
        value={chargePerDay ?? ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(v) => onChange("chargePerDay", v)}
      />

      <Text style={[styles.label, { color: colors?.text || '#333' }]}>Charge per km</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#ccc' }]}
        keyboardType="numeric"
        value={chargePerKm ?? ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(v) => onChange("chargePerKm", v)}
      />

      <Text style={[styles.label, { color: colors?.text || '#333' }]}>Waiting charge per hour</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#ccc' }]}
        keyboardType="numeric"
        value={waitingChargePerHour ?? ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(v) => onChange("waitingChargePerHour", v)}
      />

      <Text style={[styles.label, { color: colors?.text || '#333' }]}>Waiting charge per night</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#ccc' }]}
        keyboardType="numeric"
        value={waitingChargePerNight ?? ""}
        placeholderTextColor={colors?.placeholder || "#999999"}
        onChangeText={(v) => onChange("waitingChargePerNight", v)}
      />

      <Text style={[styles.label, { color: colors?.text || '#333' }]}>Fixed</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity onPress={() => onChange("fixed", "yes")}>
          <Text style={fixed === 'yes' ? [styles.activeRadio, { backgroundColor: colors?.primary || '#4A90E2', color: '#fff' }] : [styles.radio, { color: colors?.text || '#333', borderColor: colors?.border || '#ccc' }]}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onChange("fixed", "no")}>
          <Text style={fixed === 'no' ? [styles.activeRadio, { backgroundColor: colors?.primary || '#4A90E2', color: '#fff' }] : [styles.radio, { color: colors?.text || '#333', borderColor: colors?.border || '#ccc' }]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const Step2MachineryDetails = ({ formData, handleInputChange, colors }) => {
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
    { label: "Select Machinery Type", value: "" },
    { label: "Excavator", value: "excavator" },
    { label: "Bulldozer", value: "bulldozer" },
    { label: "Crane", value: "crane" },
    { label: "Loader", value: "loader" },
    { label: "Tractor", value: "tractor" },
    { label: "Generator", value: "generator" }
  ];

  const capacityOptions = [
    { label: "Select Capacity", value: "" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "Extra Large", value: "extra_large" }
  ];

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Machinery Details</Text>
        
        {machinery.map((mach, index) => (
          <View key={mach.id} style={[styles.vehicleContainer, { borderColor: colors?.border || '#eee' }]}>
            <Text style={[styles.vehicleTitle, { color: colors?.text || '#333' }]}>Machinery {index + 1}</Text>
            
            {/* Machinery Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Machinery Type *</Text>
              <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
                <Picker
                  selectedValue={mach.type || ""}
                  style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                  dropdownIconColor={colors?.text || '#000'}
                  onValueChange={(value) => updateMachinery(mach.id, "type", value)}
                >
                  {machineryTypeOptions.map((option, optionIndex) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value} 
                      color={optionIndex === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                      style={{ fontSize: 15 }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Machinery Name */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Machinery Name *</Text>
              <TextInput
                style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                value={mach.name || ""}
                onChangeText={(value) => updateMachinery(mach.id, "name", value)}
                placeholder="Enter machinery name"
                placeholderTextColor={colors?.placeholder || "#999999"}
              />
            </View>

            {/* Machinery Model */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Machinery Model *</Text>
              <TextInput
                style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                value={mach.model || ""}
                onChangeText={(value) => updateMachinery(mach.id, "model", value)}
                placeholder="Enter machinery model"
                placeholderTextColor={colors?.placeholder || "#999999"}
              />
            </View>

            {/* Horizontal Line Below Model */}
            <View style={styles.pricingContainer}>
              <Text style={[styles.pricingHeading, { color: colors?.primary || '#4A90E2' }]}>Pricing Details</Text>
              <PricingForm
                chargePerDay={formData.chargePerDay}
                chargePerKm={formData.chargePerKm}
                waitingChargePerHour={formData.waitingChargePerHour}
                waitingChargePerNight={formData.waitingChargePerNight}
                fixed={formData.fixed || 'no'}
                onChange={(key, value) => handleInputChange(key, value)}
                colors={colors}
              />
            </View>


            {/* Remove Machinery Button */}
            {machinery.length > 1 && (
              <View style={styles.removeButtonContainer}>
                <TouchableOpacity 
                  style={[styles.removeButton, { backgroundColor: colors?.secondary || '#FF6B6B' }]}
                  onPress={() => removeMachinery(mach.id)}
                >
                  <Text style={styles.removeButtonText}>Remove Machinery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        
        {/* Image Upload Section */}
        <View style={{ marginTop: 20 }}>
          <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Upload Machinery Images</Text>
          <Text style={{ marginBottom: 15, fontSize: 14, color: colors?.subText || '#666' }}>
            Upload minimum 4 and maximum 7 images of your machinery.
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
        
        {/* Add More Machinery Button - Moved to the end */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors?.primary || '#4A90E2' }]}
          onPress={addMachinery}
        >
          <Text style={styles.addButtonText}>Add Another Machinery</Text>
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
pricingContainer: {
  borderWidth: 1,
  borderColor: '#4A90E2',
  borderRadius: 5,
  padding: 15,
  marginTop: 15,
  backgroundColor: '#fff',
},

pricingHeading: {
  fontSize: 15,
  fontWeight: 'bold',
  marginBottom: 10,
  alignSelf: 'flex-start',
  color: '#000',
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

export default Step2MachineryDetails;
