import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, Picker, TouchableOpacity } from "react-native";
import { Picker as RNPicker } from '@react-native-picker/picker';
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step2VehiclesDetails = ({ formData, handleInputChange }) => {
  // Initialize vehicles array if not present
  const vehicles = formData.vehicles || [{ id: 1, type: "", name: "", model: "", seatCapacity: "", fuelType: "", acAvailable: false, chargeType: "", chargeAmount: "" }];
  
  // Function to add a new vehicle
  const addVehicle = () => {
    const newVehicle = {
      id: Date.now(),
      type: "",
      name: "",
      model: "",
      seatCapacity: "",
      fuelType: "",
      acAvailable: false,
      chargeType: "",
      chargeAmount: ""
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

  const chargeTypeOptions = [
    { label: "Select Charge Type", value: "" },
    { label: "Per Day", value: "per_day" },
    { label: "Per Hour", value: "per_hour" }
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
              <RNPicker
                selectedValue={vehicle.type || ""}
                style={categoryContentStyles.picker}
                onValueChange={(value) => updateVehicle(vehicle.id, "type", value)}
              >
                {vehicleTypeOptions.map((option) => (
                  <RNPicker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </RNPicker>
            </View>

            {/* Vehicle Name */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Vehicle Name *</Text>
              <TextInput
                style={categoryContentStyles.input}
                value={vehicle.name || ""}
                onChangeText={(value) => updateVehicle(vehicle.id, "name", value)}
                placeholder="Enter vehicle name"
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
              />
            </View>

            {/* Seat Capacity Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Seat Capacity *</Text>
              <RNPicker
                selectedValue={vehicle.seatCapacity || ""}
                style={categoryContentStyles.picker}
                onValueChange={(value) => updateVehicle(vehicle.id, "seatCapacity", value)}
              >
                {seatCapacityOptions.map((option) => (
                  <RNPicker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </RNPicker>
            </View>

            {/* Fuel Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Fuel Type *</Text>
              <RNPicker
                selectedValue={vehicle.fuelType || ""}
                style={categoryContentStyles.picker}
                onValueChange={(value) => updateVehicle(vehicle.id, "fuelType", value)}
              >
                {fuelTypeOptions.map((option) => (
                  <RNPicker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </RNPicker>
            </View>

            {/* AC Availability Radio Buttons */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>AC Available? *</Text>
              <View style={styles.radioContainer}>
                <View style={styles.radioButtonContainer}>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => updateVehicle(vehicle.id, "acAvailable", true)}
                  >
                    {vehicle.acAvailable === true && <View style={styles.radioButtonSelected} />}
                  </TouchableOpacity>
                  <Text style={styles.radioLabel}>Yes</Text>
                </View>
                <View style={styles.radioButtonContainer}>
                  <TouchableOpacity 
                    style={styles.radioButton}
                    onPress={() => updateVehicle(vehicle.id, "acAvailable", false)}
                  >
                    {vehicle.acAvailable === false && <View style={styles.radioButtonSelected} />}
                  </TouchableOpacity>
                  <Text style={styles.radioLabel}>No</Text>
                </View>
              </View>
            </View>

            {/* Charge Type Dropdown */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Charge Type *</Text>
              <RNPicker
                selectedValue={vehicle.chargeType || ""}
                style={categoryContentStyles.picker}
                onValueChange={(value) => updateVehicle(vehicle.id, "chargeType", value)}
              >
                {chargeTypeOptions.map((option) => (
                  <RNPicker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </RNPicker>
            </View>

            {/* Charge Amount */}
            <View style={categoryContentStyles.inputContainer}>
              <Text style={categoryContentStyles.label}>Charge Amount *</Text>
              <TextInput
                style={categoryContentStyles.input}
                value={vehicle.chargeAmount || ""}
                onChangeText={(value) => updateVehicle(vehicle.id, "chargeAmount", value)}
                placeholder="Enter charge amount"
                keyboardType="numeric"
              />
            </View>

            {/* Remove Vehicle Button (except for the first one) */}
            {vehicles.length > 1 && (
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeVehicle(vehicle.id)}
              >
                <Text style={styles.removeButtonText}>Remove Vehicle</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add More Vehicle Button */}
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
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  addButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Step2VehiclesDetails;