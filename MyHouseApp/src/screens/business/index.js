import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2BusinessDetailsComponent from './Step2BusinessDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for business form
const validateBusinessForm = (formData) => {
  // Validate Step 1 fields
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo || !formData.advanceAmount || 
      !formData.rentAmount || formData.images.length < 4 || formData.images.length > 8) {
    alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
    return false;
  }

  // Validate Step 2 business fields
  if (!formData.doorFacing || !formData.propertyType || !formData.areaLength || 
      !formData.areaBreadth || formData.floorNumber === "") {
    alert("Validation Error", "Please fill in all required business details");
    return false;
  }

  // Validate numeric fields
  if (isNaN(formData.areaLength) || isNaN(formData.areaBreadth) || parseFloat(formData.areaLength) <= 0 || parseFloat(formData.areaBreadth) <= 0) {
    alert("Validation Error", "Length and breadth must be positive numbers");
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