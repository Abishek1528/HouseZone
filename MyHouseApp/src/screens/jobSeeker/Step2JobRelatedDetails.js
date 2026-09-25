import React from "react";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";

const educationOptions = [
  { label: "10th/12th", value: "10th/12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
  { label: "Diploma", value: "diploma" },
];

const experienceOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

const experienceYearOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "1-2 Years", value: "1-2" },
  { label: "2-4 Years", value: "2-4" },
  { label: "4+ Years", value: "4+" },
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
    <OptionSelectField
      label="Educational Qualification *"
      options={educationOptions}
      selectedValue={formData.education || ""}
      onSelect={(value) => handleInputChange("education", value)}
      colors={colors}
      dark={dark}
      collapsible
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
        <OptionSelectField
          label="Experience Years *"
          options={experienceYearOptions}
          selectedValue={formData.experienceYears || ""}
          onSelect={(value) => handleInputChange("experienceYears", value)}
          colors={colors}
          dark={dark}
          collapsible
        />
        <OwnerFormField
          label="Last Working Company *"
          value={formData.lastWorkingShop}
          onChangeText={(value) => handleInputChange("lastWorkingShop", value)}
          colors={colors}
          dark={dark}
          placeholder="Name of your last workplace"
        />
        <OwnerFormField
          label="Add Experience"
          value={formData.addExperience}
          onChangeText={(value) => handleInputChange("addExperience", value)}
          colors={colors}
          dark={dark}
          placeholder="Describe your work experience"
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
