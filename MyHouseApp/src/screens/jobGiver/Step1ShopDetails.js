import React, { useState, useEffect } from "react";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import { sanitizePhoneInput } from "../../shared/utils/phoneInput";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const DEFAULT_AREA_OPTIONS = [
  { label: "Vandigate", value: "vandigate" },
  { label: "Ammapettai", value: "ammapettai" },
  { label: "Omakulam", value: "omakulam" },
  { label: "Anamalai Nagar", value: "anamalai nagar" },
  { label: "Chidambaram Town", value: "chidambaram town" },
];

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

const Step1ShopDetails = ({ formData, handleInputChange, colors, dark }) => {
  const [areaOptions, setAreaOptions] = useState(DEFAULT_AREA_OPTIONS);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/job-options/areas`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map(item => ({
              label: item.name || item.title,
              value: item.name || item.title
            }));
            setAreaOptions(formatted);
          }
        }
      } catch (err) {
        console.warn("[Step1ShopDetails] Using default area options:", err);
      }
    };
    fetchAreas();
  }, []);

  return (

  <OwnerFormCard
    title="Personal Info"
    subtitle="Page 1"
    colors={colors}
    dark={dark}
  >
    <OwnerFormField
      label="Owner Name *"
      value={formData.ownerName}
      onChangeText={(value) => handleInputChange("ownerName", value)}
      colors={colors}
      dark={dark}
    />
    <OwnerFormField
      label="Company Name *"
      value={formData.shopName}
      onChangeText={(value) => handleInputChange("shopName", value)}
      colors={colors}
      dark={dark}
    />
    <OptionSelectField
      label="Company Type *"
      options={shopTypeOptions}
      selectedValue={formData.shopType || ""}
      onSelect={(value) => handleInputChange("shopType", value)}
      colors={colors}
      dark={dark}
      collapsible
    />
    <OptionSelectField
      label="Area *"
      options={areaOptions}
      selectedValue={formData.area || ""}
      onSelect={(value) => handleInputChange("area", value)}
      colors={colors}
      dark={dark}
      collapsible
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
};

export default Step1ShopDetails;

