import React from "react";
import { Text } from "react-native";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";

const experienceOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

const joinImmediatelyOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const Step2JobRelatedDetails = ({ formData, handleInputChange, colors, dark }) => (
  <OwnerFormCard
    title="Job Related Details"
    subtitle="Your job preferences and information"
    colors={colors}
    dark={dark}
  >
    <OwnerFormField
      label="Current Location (City/Town) *"
      value={formData.currentLocation}
      onChangeText={(value) => handleInputChange("currentLocation", value)}
      colors={colors}
      dark={dark}
    />
    <OptionSelectField
      label="Experience (Fresher/Experienced) *"
      options={experienceOptions}
      selectedValue={formData.experience || ""}
      onSelect={(value) => handleInputChange("experience", value)}
      colors={colors}
      dark={dark}
      collapsible
    />
    <OwnerFormField
      label="Educational Qualification"
      value={formData.education}
      onChangeText={(value) => handleInputChange("education", value)}
      colors={colors}
      dark={dark}
      placeholder="e.g., 12th Pass, Graduate, etc."
    />
    <OptionSelectField
      label="Can Join Immediately? *"
      options={joinImmediatelyOptions}
      selectedValue={formData.canJoinImmediately || ""}
      onSelect={(value) => handleInputChange("canJoinImmediately", value)}
      colors={colors}
      dark={dark}
      collapsible
    />
  </OwnerFormCard>
);

export default Step2JobRelatedDetails;
