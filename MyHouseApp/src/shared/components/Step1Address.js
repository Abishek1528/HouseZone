import React from "react";
import OwnerFormField from "./OwnerFormField";
import OwnerFormCard from "./OwnerFormCard";
import { sanitizePhoneInput } from "../utils/phoneInput";

const getStep1Titles = (category) => {
  if (category === "residential") {
    return {
      title: "Residential Address",
      subtitle: "Owner contact and residential property location",
      nameLabel: "Name of the Person *",
    };
  }
  if (category === "business") {
    return {
      title: "Commercial place Address",
      subtitle: "Owner contact and commercial property location",
      nameLabel: "Name of the Owner *",
    };
  }
  return {
    title: "Address Information",
    subtitle: "Owner contact and property location",
    nameLabel: "Name of the Person *",
  };
};

const Step1Address = ({ formData, handleInputChange, errors, onBlur, colors, dark, category }) => {
  const labels = getStep1Titles(category);
  return (
    <OwnerFormCard
      title={labels.title}
      subtitle={labels.subtitle}
      colors={colors}
      dark={dark}
    >
      <OwnerFormField
        label={labels.nameLabel}
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
};

export default Step1Address;
