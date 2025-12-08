import React from "react";
import BaseForm from '../../shared/components/BaseForm';
import Step2VehiclesDetailsComponent from './Step2VehiclesDetails';
import { initialFormData } from './logic/mainLogic';

// Custom validation for vehicles form
const validateVehiclesForm = (formData) => {
  // Validate Step 1 fields
  if (!formData.name || !formData.doorNo || !formData.street || !formData.pincode || 
      !formData.area || !formData.city || !formData.contactNo || !formData.advanceAmount || 
      !formData.rentAmount || formData.images.length < 4 || formData.images.length > 8) {
    alert("Validation Error", "Please fill in all required fields and upload between 4 and 8 images");
    return false;
  }

  // Validate vehicles data
  if (!formData.vehicles || formData.vehicles.length === 0) {
    alert("Validation Error", "Please add at least one vehicle");
    return false;
  }

  // Validate each vehicle
  for (let i = 0; i < formData.vehicles.length; i++) {
    const vehicle = formData.vehicles[i];
    if (!vehicle.type || !vehicle.name || !vehicle.model || !vehicle.seatCapacity || 
        !vehicle.fuelType || !vehicle.chargeType || !vehicle.chargeAmount) {
      alert("Validation Error", `Please fill in all required fields for vehicle ${i + 1}`);
      return false;
    }

    // Validate numeric fields
    if (isNaN(vehicle.chargeAmount) || parseFloat(vehicle.chargeAmount) <= 0) {
      alert("Validation Error", `Charge amount for vehicle ${i + 1} must be a positive number`);
      return false;
    }
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