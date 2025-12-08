import React from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, CheckBox, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step2BusinessDetails = ({ formData, handleInputChange }) => {
  // Define options for dropdowns
  const doorFacingOptions = [
    { label: "Select Door Facing", value: "" },
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" }
  ];

  const propertyTypeOptions = [
    { label: "Select Property Type", value: "" },
    { label: "Shop", value: "shop" },
    { label: "Office", value: "office" },
    { label: "Warehouse", value: "warehouse" },
    { label: "Showroom", value: "showroom" }
  ];

  const floorOptions = [
    { label: "Select Floor", value: "" },
    { label: "Ground", value: "ground" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "Basement", value: "basement" }
  ];

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Business Details</Text>
        
        {/* Door Facing Dropdown */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={categoryContentStyles.label}>Door Facing *</Text>
          <Picker
            selectedValue={formData.doorFacing || ""}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange("doorFacing", value)}
          >
            {doorFacingOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        {/* Property Type Dropdown */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={categoryContentStyles.label}>Property Type *</Text>
          <Picker
            selectedValue={formData.propertyType || ""}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange("propertyType", value)}
          >
            {propertyTypeOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        {/* Total Area - Length and Breadth */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={categoryContentStyles.label}>Total Area *</Text>
          <View style={styles.areaContainer}>
            <View style={styles.areaInputContainer}>
              <Text style={styles.areaLabel}>Length (feet)</Text>
              <TextInput
                style={categoryContentStyles.input}
                value={formData.areaLength || ""}
                onChangeText={(value) => handleInputChange("areaLength", value)}
                placeholder="Enter length"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.areaInputContainer}>
              <Text style={styles.areaLabel}>Breadth (feet)</Text>
              <TextInput
                style={categoryContentStyles.input}
                value={formData.areaBreadth || ""}
                onChangeText={(value) => handleInputChange("areaBreadth", value)}
                placeholder="Enter breadth"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Restroom Checkboxes */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={categoryContentStyles.label}>Restroom Available? *</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity 
                style={styles.radioButton}
                onPress={() => handleInputChange("restroomAvailable", true)}
              >
                {formData.restroomAvailable === true && <View style={styles.radioButtonSelected} />}
              </TouchableOpacity>
              <Text style={styles.radioLabel}>Yes</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity 
                style={styles.radioButton}
                onPress={() => handleInputChange("restroomAvailable", false)}
              >
                {formData.restroomAvailable === false && <View style={styles.radioButtonSelected} />}
              </TouchableOpacity>
              <Text style={styles.radioLabel}>No</Text>
            </View>
          </View>
        </View>

        {/* Floor Number Dropdown */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={categoryContentStyles.label}>Floor Number *</Text>
          <Picker
            selectedValue={formData.floorNumber || ""}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange("floorNumber", value)}
          >
            {floorOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  areaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  areaInputContainer: {
    flex: 0.48,
  },
  areaLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90E2',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default Step2BusinessDetails;