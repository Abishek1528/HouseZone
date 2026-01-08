import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2MachineryDetailsComponent from './Step2MachineryDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for machinery form
const validateMachineryForm = (formData) => {
  // Validate Step 1 fields
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo) {
    alert("Validation Error", "Please fill in all required address fields");
    return false;
  }
  
  // Validate image requirements
  if (!formData.images || formData.images.length < 4 || formData.images.length > 7) {
    alert("Validation Error", "Please upload between 4 and 7 images");
    return false;
  }

  // Validate machinery data
  if (!formData.machinery || formData.machinery.length === 0) {
    alert("Validation Error", "Please add at least one machinery");
    return false;
  }

  // Validate each machinery
  for (let i = 0; i < formData.machinery.length; i++) {
    const machinery = formData.machinery[i];
    if (!machinery.type || !machinery.name || !machinery.model) {
      alert("Validation Error", `Please fill in all required fields for machinery ${i + 1}`);
      return false;
    }
  }

  return true;
};

export default function AddMachinery() {
  return (
    <BaseForm
      title="Add Machinery"
      step2Component={Step2MachineryDetailsComponent}
      initialFormData={initialFormData}
      validationFunction={validateMachineryForm}
      successMessage="Machinery details added successfully!"
      navigationTarget="Machinery"
      category="machinery"
    />
  );
}