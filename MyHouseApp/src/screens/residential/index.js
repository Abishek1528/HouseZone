import React from "react";
import { Alert } from "react-native"; // Import Alert from react-native
import BaseForm from '../../shared/components/BaseForm';
import Step2DetailsComponent from './Step2Details';
import { initialFormData } from './logic/mainLogic';

// Custom validation for residential form - step 2 validation only
const validateResidentialForm = (formData) => {
  // Validate Step 2 fields only
  if (!formData.facingDirection || !formData.hallLength || !formData.hallBreadth || 
      !formData.noOfBedrooms || !formData.bedroom1Length || !formData.bedroom1Breadth || 
      !formData.kitchenLength || !formData.kitchenBreadth || !formData.noOfBathrooms || 
      !formData.bathroom1Type || !formData.floorNo) {
    Alert.alert("Validation Error", "Please fill in all required house details in Step 2");
    return false;
  }

  // Validate that numeric fields are actually numbers
  const numericFields = [
    'hallLength', 'hallBreadth', 'bedroom1Length', 'bedroom1Breadth',
    'kitchenLength', 'kitchenBreadth'
  ];

  for (const field of numericFields) {
    if (formData[field] && (isNaN(parseFloat(formData[field])) || parseFloat(formData[field]) <= 0)) {
      Alert.alert("Validation Error", `Please enter a valid positive number for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }
  }

  // Validate conditional bedroom fields
  const numBedrooms = parseInt(formData.noOfBedrooms);
  if (numBedrooms >= 2 && (!formData.bedroom2Length || !formData.bedroom2Breadth)) {
    Alert.alert("Validation Error", "Please fill in Bedroom 2 dimensions");
    return false;
  }
  if (numBedrooms >= 3 && (!formData.bedroom3Length || !formData.bedroom3Breadth)) {
    Alert.alert("Validation Error", "Please fill in Bedroom 3 dimensions");
    return false;
  }

  // Validate that bedroom numeric fields are actually numbers
  const bedroomFields = ['bedroom2Length', 'bedroom2Breadth', 'bedroom3Length', 'bedroom3Breadth'];
  for (const field of bedroomFields) {
    if (formData[field] && (isNaN(parseFloat(formData[field])) || parseFloat(formData[field]) <= 0)) {
      Alert.alert("Validation Error", `Please enter a valid positive number for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }
  }

  // Validate conditional bathroom fields
  const numBathrooms = parseInt(formData.noOfBathrooms);
  if (numBathrooms >= 2 && !formData.bathroom2Type) {
    Alert.alert("Validation Error", "Please select Bathroom 2 type");
    return false;
  }
  if (numBathrooms >= 3 && !formData.bathroom3Type) {
    Alert.alert("Validation Error", "Please select Bathroom 3 type");
    return false;
  }

  return true;
};

export default function AddHouse() {
  return (
    <BaseForm
      title="Add House"
      step2Component={Step2DetailsComponent}
      initialFormData={initialFormData}
      validationFunction={validateResidentialForm}
      successMessage="House details added successfully!"
      navigationTarget="Residential"
      category="residential" // Added category prop
    />
  );
}