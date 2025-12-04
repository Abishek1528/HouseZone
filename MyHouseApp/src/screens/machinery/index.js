import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2MachineryDetailsComponent from './Step2MachineryDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for machinery form
const validateMachineryForm = (formData) => {
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo || !formData.machineryType || 
      !formData.machineryName || !formData.advanceAmount || !formData.rentAmount ||
      formData.images.length < 4 || formData.images.length > 8) {
    alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
    return false;
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
    />
  );
}