import React from "react";
import { Alert } from "react-native";
import BaseForm from '../../shared/components/BaseForm';
import Step2BusinessDetailsComponent from './Step2BusinessDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for business form
const validateBusinessForm = (formData) => {
  // Validate Step 2 business fields
  if (!formData.doorFacing || !formData.propertyType || !formData.areaLength || 
      !formData.areaBreadth || formData.floorNumber === "") {
    Alert.alert("Validation Error", "Please fill in all required business details in Step 2");
    return false;
  }

  // Validate numeric fields
  if (isNaN(formData.areaLength) || isNaN(formData.areaBreadth) || parseFloat(formData.areaLength) <= 0 || parseFloat(formData.areaBreadth) <= 0) {
    Alert.alert("Validation Error", "Length and breadth must be positive numbers");
    return false;
  }

  return true;
};

export default function AddBusiness() {
  return (
    <BaseForm
      title="Add Business"
      step2Component={Step2BusinessDetailsComponent}
      initialFormData={initialFormData}
      validationFunction={validateBusinessForm}
      successMessage="Business details added successfully!"
      navigationTarget="Business"
      category="business"
    />
  );
}