import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2BusinessDetailsComponent from './Step2BusinessDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for business form
const validateBusinessForm = (formData) => {
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo || !formData.businessType || 
      !formData.businessName || !formData.advanceAmount || !formData.rentAmount ||
      formData.images.length < 4 || formData.images.length > 8) {
    alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
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
    />
  );
}