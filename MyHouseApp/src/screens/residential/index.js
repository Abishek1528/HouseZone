import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2DetailsComponent from './Step2Details';
import { initialFormData } from './logic/mainLogic';

// Custom validation for residential form
const validateResidentialForm = (formData) => {
  // Validate Step 1 fields
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo || !formData.advanceAmount || 
      !formData.rentAmount || formData.images.length < 4 || formData.images.length > 8) {
    alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
    return false;
  }

  // Validate Step 2 fields
  if (!formData.facingDirection || !formData.hallLength || !formData.hallBreadth || 
      !formData.noOfBedrooms || !formData.bedroom1Length || !formData.bedroom1Breadth || 
      !formData.kitchenLength || !formData.kitchenBreadth || !formData.noOfBathrooms || 
      !formData.bathroom1Type || !formData.floorNo) {
    alert("Validation Error", "Please fill in all required house details");
    return false;
  }

  // Validate conditional bedroom fields
  const numBedrooms = parseInt(formData.noOfBedrooms);
  if (numBedrooms >= 2 && (!formData.bedroom2Length || !formData.bedroom2Breadth)) {
    alert("Validation Error", "Please fill in Bedroom 2 dimensions");
    return false;
  }
  if (numBedrooms >= 3 && (!formData.bedroom3Length || !formData.bedroom3Breadth)) {
    alert("Validation Error", "Please fill in Bedroom 3 dimensions");
    return false;
  }

  // Validate conditional bathroom fields
  const numBathrooms = parseInt(formData.noOfBathrooms);
  if (numBathrooms >= 2 && !formData.bathroom2Type) {
    alert("Validation Error", "Please select Bathroom 2 type");
    return false;
  }
  if (numBathrooms >= 3 && !formData.bathroom3Type) {
    alert("Validation Error", "Please select Bathroom 3 type");
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