import React from "react";
import { Text } from "react-native";
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

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const educationOptions = [
  { label: "Any", value: "any" },
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
];

const experienceOptions = [
  { label: "Fresh", value: "fresh" },
  { label: "1 Year", value: "1year" },
  { label: "2+ Years", value: "2plus" },
];

const ageOptions = [
  { label: "18-25", value: "18-25" },
  { label: "25-40", value: "25-40" },
  { label: "40-50", value: "40-50" },
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
      subtitle="What work you need in your shop"
      colors={colors}
      dark={dark}
    >
      <OwnerFormField
        label="Job Title *"
        value={formData.jobTitle}
        onChangeText={(value) => handleInputChange("jobTitle", value)}
        placeholder="Salesman, helper, cashier..."
        colors={colors}
        dark={dark}
      />
      <OwnerFormField
        label="Workers Needed *"
        value={formData.numberOfWorkersNeeded}
        onChangeText={(value) => handleInputChange("numberOfWorkersNeeded", value.replace(/\D/g, ""))}
        keyboardType="numeric"
        colors={colors}
        dark={dark}
      />

      <Text style={[ofs.sectionBlockTitle, { marginBottom: 4 }]}>Work Timings *</Text>
      <Text style={[ofs.subtitle, { textAlign: "left", marginBottom: 10 }]}>
        Choose start and end time using the clock.
      </Text>
      <TimeSelectField
        label="Start Time *"
        value={formData.workStartTime}
        onChange={updateWorkStart}
        colors={colors}
        dark={dark}
      />
      <TimeSelectField
        label="End Time *"
        value={formData.workEndTime}
        onChange={updateWorkEnd}
        colors={colors}
        dark={dark}
      />
      {formData.workStartTime && formData.workEndTime ? (
        <Text style={[ofs.subtitle, { textAlign: "left", marginBottom: 8 }]}>
          Timings: {formData.workStartTime} - {formData.workEndTime}
        </Text>
      ) : null}

      <OwnerFormField
        label="Salary Offered Per Month (₹) *"
        value={formData.salaryOffered}
        onChangeText={(value) => handleInputChange("salaryOffered", value.replace(/\D/g, ""))}
        keyboardType="numeric"
        colors={colors}
        dark={dark}
      />
      <OptionSelectField
        label="Experience Needed *"
        options={experienceOptions}
        selectedValue={formData.experienceNeeded || ""}
        onSelect={(value) => handleInputChange("experienceNeeded", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Education Needed *"
        options={educationOptions}
        selectedValue={formData.educationNeeded || ""}
        onSelect={(value) => handleInputChange("educationNeeded", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Age Preference *"
        options={ageOptions}
        selectedValue={formData.agePreference || ""}
        onSelect={(value) => handleInputChange("agePreference", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Gender Preference *"
        options={genderOptions}
        selectedValue={formData.genderPreference || ""}
        onSelect={(value) => handleInputChange("genderPreference", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Food Provided *"
        options={yesNoOptions}
        selectedValue={formData.foodProvided || ""}
        onSelect={(value) => handleInputChange("foodProvided", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OptionSelectField
        label="Accommodation Provided *"
        options={yesNoOptions}
        selectedValue={formData.accommodationProvided || ""}
        onSelect={(value) => handleInputChange("accommodationProvided", value)}
        colors={colors}
        dark={dark}
        collapsible
      />
      <OwnerFormField
        label="Job Description"
        value={formData.jobDescription}
        onChangeText={(value) => handleInputChange("jobDescription", value)}
        placeholder="Daily work, shop duties..."
        multiline
        colors={colors}
        dark={dark}
      />
    </OwnerFormCard>
  );
};

export default Step2JobDetails;
