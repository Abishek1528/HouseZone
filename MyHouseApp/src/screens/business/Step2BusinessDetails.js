import React from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step2BusinessDetails = ({ formData, handleInputChange, colors }) => {
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
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Business Details</Text>
        
        {/* Door Facing Dropdown */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Door Facing *</Text>
          <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
            <Picker
              selectedValue={formData.doorFacing || ""}
              style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
              dropdownIconColor={colors?.text || '#000'}
              onValueChange={(value) => handleInputChange("doorFacing", value)}
            >
              {doorFacingOptions.map((option, index) => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value} 
                  color={index === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                  style={{ fontSize: 15 }}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Property Type Dropdown */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Property Type *</Text>
          <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
            <Picker
              selectedValue={formData.propertyType || ""}
              style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
              dropdownIconColor={colors?.text || '#000'}
              onValueChange={(value) => handleInputChange("propertyType", value)}
            >
              {propertyTypeOptions.map((option, index) => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value} 
                  color={index === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                  style={{ fontSize: 15 }}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Total Area - Length and Breadth */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Total Area *</Text>
          <View style={styles.areaContainer}>
            <View style={styles.areaInputContainer}>
              <Text style={[styles.areaSubLabel, { color: colors?.subText || '#333' }]}>Length (feet)</Text>
              <TextInput
                style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                value={formData.areaLength || ""}
                onChangeText={(value) => handleInputChange("areaLength", value)}
                placeholder="Enter length"
                placeholderTextColor={colors?.placeholder || "#999999"}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.areaInputContainer}>
              <Text style={[styles.areaSubLabel, { color: colors?.subText || '#333' }]}>Breadth (feet)</Text>
              <TextInput
                style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                value={formData.areaBreadth || ""}
                onChangeText={(value) => handleInputChange("areaBreadth", value)}
                placeholder="Enter breadth"
                placeholderTextColor={colors?.placeholder || "#999999"}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Restroom Checkboxes */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Restroom Available? *</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity 
                style={[styles.radioButton, { borderColor: colors?.border || '#ccc' }]}
                onPress={() => handleInputChange("restroomAvailable", true)}
              >
                {formData.restroomAvailable === true && <View style={[styles.radioButtonSelected, { backgroundColor: colors?.primary || '#4A90E2' }]} />}
              </TouchableOpacity>
              <Text style={[styles.radioLabel, { color: colors?.text || '#333' }]}>Yes</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <TouchableOpacity 
                style={[styles.radioButton, { borderColor: colors?.border || '#ccc' }]}
                onPress={() => handleInputChange("restroomAvailable", false)}
              >
                {formData.restroomAvailable === false && <View style={[styles.radioButtonSelected, { backgroundColor: colors?.primary || '#4A90E2' }]} />}
              </TouchableOpacity>
              <Text style={[styles.radioLabel, { color: colors?.text || '#333' }]}>No</Text>
            </View>
          </View>
        </View>

        {/* Floor Number Dropdown */}
        <View style={categoryContentStyles.inputContainer}>
          <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Floor Number *</Text>
          <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
            <Picker
              selectedValue={formData.floorNumber || ""}
              style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
              dropdownIconColor={colors?.text || '#000'}
              onValueChange={(value) => handleInputChange("floorNumber", value)}
            >
              {floorOptions.map((option, index) => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value} 
                  color={index === 0 ? (colors?.placeholder || '#999999') : (colors?.text || '#000000')}
                  style={{ fontSize: 15 }}
                />
              ))}
            </Picker>
          </View>
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
  areaSubLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold',
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