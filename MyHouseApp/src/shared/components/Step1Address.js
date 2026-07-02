import React from "react";
import OwnerFormField from "./OwnerFormField";
import OwnerFormCard from "./OwnerFormCard";
import { sanitizePhoneInput } from "../utils/phoneInput";

const Step1Address = ({ formData, handleInputChange, errors, onBlur, colors, dark }) => (
  <OwnerFormCard
    title="Address Information"
    subtitle="Owner contact and property location"
    colors={colors}
    dark={dark}
  >
    <OwnerFormField
      label="Name of the Person *"
      value={formData.name}
      onChangeText={(value) => handleInputChange("name", value)}
      placeholder=""
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Door No *"
      value={formData.doorNo}
      onChangeText={(value) => handleInputChange("doorNo", value)}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Street *"
      value={formData.street}
      onChangeText={(value) => handleInputChange("street", value)}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Pincode *"
      value={formData.pincode}
      onChangeText={(value) => handleInputChange("pincode", value.replace(/\D/g, ""))}
      onBlur={() => onBlur("pincode", formData.pincode)}
      keyboardType="numeric"
      maxLength={6}
      error={errors.pincode}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Area *"
      value={formData.area}
      onChangeText={(value) => handleInputChange("area", value)}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="City *"
      value={formData.city}
      onChangeText={(value) => handleInputChange("city", value)}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Contact No *"
      value={formData.contactNo}
      onChangeText={(value) => handleInputChange("contactNo", sanitizePhoneInput(value))}
      onBlur={() => onBlur("contactNo", formData.contactNo)}
      keyboardType="phone-pad"
      maxLength={10}
      error={errors.contactNo}
      colors={colors}
      dark={dark}
    />
  </OwnerFormCard>
);

export default Step1Address;
