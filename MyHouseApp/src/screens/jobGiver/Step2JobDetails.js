import React from "react";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import TimeSelectField from "../../shared/components/TimeSelectField";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Any", value: "any" },
];

const ageOptions = [
  { label: "Any", value: "Any" },
  { label: "20-30", value: "20-30" },
  { label: "30-40", value: "30-40" },
  { label: "40-50", value: "40-50" },
];

const educationOptions = [
  { label: "Any", value: "any" },
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
];

const employmentTypeOptions = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
];

const experienceYearOptions = [
  { label: "Fresh", value: "fresh" },
  { label: "1 Year", value: "1year" },
  { label: "2 Years", value: "2years" },
  { label: "3+ Years", value: "3plus" },
];

const Step2JobDetails = ({ formData, handleInputChange, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);

  const updateWorkStart = (time) => {
    handleInputChange("workStartTime", time);
    if (formData.workEndTime) {
      handleInputChange("workTimings", `${time} - ${formData.workEndTime}`);
    }
  };

  const updateWorkEnd = (time) => {
    handleInputChange("workEndTime", time);
    if (formData.workStartTime) {
      handleInputChange("workTimings", `${formData.workStartTime} - ${time}`);
    }
  };

  return (
    <OwnerFormCard
      title="Job Details"
      subtitle="Page 2"
      colors={colors}
      dark={dark}
    >
      <OwnerFormField
        label="Job Title *"
        value={formData.jobTitle}
        onChangeText={(value) => handleInputChange("jobTitle", value)}
        placeholder="e.g., Salesman, Cashier, etc."
        colors={colors}
        dark={dark}
      />
      <OptionSelectField
        label="Employment Type *"
        options={employmentTypeOptions}
        selectedValue={formData.employmentType || ""}
        onSelect={(value) => handleInputChange("employmentType", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Age *"
        options={ageOptions}
        selectedValue={formData.age || ""}
        onSelect={(value) => handleInputChange("age", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Gender *"
        options={genderOptions}
        selectedValue={formData.gender || ""}
        onSelect={(value) => handleInputChange("gender", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Education *"
        options={educationOptions}
        selectedValue={formData.education || ""}
        onSelect={(value) => handleInputChange("education", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Experience Year *"
        options={experienceYearOptions}
        selectedValue={formData.experienceYear || ""}
        onSelect={(value) => handleInputChange("experienceYear", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OwnerFormField
        label="Experience Field *"
        value={formData.experienceField}
        onChangeText={(value) => handleInputChange("experienceField", value)}
        placeholder="Sales, cashier, etc."
        colors={colors}
        dark={dark}
      />
      <TimeSelectField
        label="Working Time Start *"
        value={formData.workStartTime}
        onChange={updateWorkStart}
        colors={colors}
        dark={dark}
      />
      <TimeSelectField
        label="Working Time End *"
        value={formData.workEndTime}
        onChange={updateWorkEnd}
        colors={colors}
        dark={dark}
      />
    </OwnerFormCard>
  );
};

export default Step2JobDetails;
