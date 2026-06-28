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
      label="Educational Qualification *"
      value={formData.education}
      onChangeText={(value) => handleInputChange("education", value)}
      colors={colors}
      dark={dark}
      placeholder="e.g., 12th Pass, Graduate, etc."
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
    {formData.experience === "experienced" && (
      <>
        <OwnerFormField
          label="Experience Years *"
          value={formData.experienceYears}
          onChangeText={(value) => handleInputChange("experienceYears", value)}
          colors={colors}
          dark={dark}
          placeholder="e.g., 2, 5, etc."
        />
        <OwnerFormField
          label="Last Working Shop *"
          value={formData.lastWorkingShop}
          onChangeText={(value) => handleInputChange("lastWorkingShop", value)}
          colors={colors}
          dark={dark}
          placeholder="Name of your last workplace"
        />
        <OwnerFormField
          label="Other Skills *"
          value={formData.otherSkills}
          onChangeText={(value) => handleInputChange("otherSkills", value)}
          colors={colors}
          dark={dark}
          placeholder="Any additional skills you have"
        />
      </>
    )}
    {formData.experience === "fresher" && (
      <>
        <OwnerFormField
          label="Experience Years"
          value={formData.experienceYears}
          onChangeText={(value) => handleInputChange("experienceYears", value)}
          colors={colors}
          dark={dark}
          placeholder="e.g., 0"
        />
        <OwnerFormField
          label="Last Working Shop"
          value={formData.lastWorkingShop}
          onChangeText={(value) => handleInputChange("lastWorkingShop", value)}
          colors={colors}
          dark={dark}
          placeholder="Name of your last workplace (if any)"
        />
        <OwnerFormField
          label="Other Skills"
          value={formData.otherSkills}
          onChangeText={(value) => handleInputChange("otherSkills", value)}
          colors={colors}
          dark={dark}
          placeholder="Any additional skills you have"
        />
      </>
    )}
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
