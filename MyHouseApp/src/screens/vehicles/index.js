import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2VehiclesDetailsComponent from './Step2VehiclesDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for vehicles form
const validateVehiclesForm = (formData) => {
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo || !formData.vehicleType || 
      !formData.brand || !formData.advanceAmount || !formData.rentAmount ||
      formData.images.length < 4 || formData.images.length > 8) {
    alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
    return false;
  }
  return true;
};

export default function AddVehicles() {
  return (
    <BaseForm
      title="Add Vehicle"
      step2Component={Step2VehiclesDetailsComponent}
      initialFormData={initialFormData}
      validationFunction={validateVehiclesForm}
      successMessage="Vehicle details added successfully!"
      navigationTarget="Vehicles"
    />
  );
}