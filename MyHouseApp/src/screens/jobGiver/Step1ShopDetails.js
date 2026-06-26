import React from "react";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import { sanitizePhoneInput } from "../../shared/utils/phoneInput";

const shopTypeOptions = [
  { label: "Jewelry", value: "jewelry" },
  { label: "Textile", value: "textile" },
  { label: "Grocery", value: "grocery" },
  { label: "Hotel / Tiffin", value: "hotel" },
  { label: "Medical", value: "medical" },
  { label: "Electronics", value: "electronics" },
  { label: "Bakery", value: "bakery" },
  { label: "Other", value: "other" },
];

const Step1ShopDetails = ({ formData, handleInputChange, colors, dark }) => (
  <OwnerFormCard
    title="Personal Info"
    subtitle="Page 1"
    colors={colors}
    dark={dark}
  >
    <OwnerFormField
      label="Name *"
      value={formData.name}
      onChangeText={(value) => handleInputChange("name", value)}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Shop Name *"
      value={formData.shopName}
      onChangeText={(value) => handleInputChange("shopName", value)}
      colors={colors}
      dark={dark}
    />
    <OptionSelectField
      label="Shop Type *"
      options={shopTypeOptions}
      selectedValue={formData.shopType || ""}
      onSelect={(value) => handleInputChange("shopType", value)}
      colors={colors}
      dark={dark}
      collapsible
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
      label="Landmark"
      value={formData.landmark}
      onChangeText={(value) => handleInputChange("landmark", value)}
      placeholder="Near bus stand, temple, etc."
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Contact *"
      value={formData.contact}
      onChangeText={(value) => handleInputChange("contact", sanitizePhoneInput(value))}
      keyboardType="phone-pad"
      maxLength={10}
      colors={colors}
      dark={dark}
    />
  </OwnerFormCard>
);

export default Step1ShopDetails;
