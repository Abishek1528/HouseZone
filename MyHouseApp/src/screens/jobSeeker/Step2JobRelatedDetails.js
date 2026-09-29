import React, { useState, useEffect } from "react";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const DEFAULT_EXPERIENCE_TITLE_OPTIONS = [
  { label: "Manager", value: "Manager" },
  { label: "Cashier", value: "Cashier" },
  { label: "Salesperson", value: "Salesperson" },
  { label: "Accountant", value: "Accountant" },
  { label: "Supervisor", value: "Supervisor" },
  { label: "Helper", value: "Helper" },
  { label: "Others", value: "Others" },
];

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

const Step2JobRelatedDetails = ({ formData, handleInputChange, colors, dark }) => {
  const [experienceTitleOptions, setExperienceTitleOptions] = useState(DEFAULT_EXPERIENCE_TITLE_OPTIONS);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/job-options/titles`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map(item => ({
              label: item.title,
              value: item.title
            }));
            if (!formatted.some(item => item.value.toLowerCase() === 'others' || item.value.toLowerCase() === 'other')) {
              formatted.push({ label: "Others", value: "Others" });
            }
            setExperienceTitleOptions(formatted);
          }
        }
      } catch (err) {
        console.warn("[Step2JobRelatedDetails] Using default title options:", err);
      }
    };
    fetchTitles();
  }, []);

  const isOtherExperience = formData.addExperience === "Others" || formData.addExperience === "Other";

  return (
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
          <OptionSelectField
            label="Add Experience *"
            options={experienceTitleOptions}
            selectedValue={formData.addExperience || ""}
            onSelect={(value) => handleInputChange("addExperience", value)}
            colors={colors}
            dark={dark}
            collapsible
          />
          {isOtherExperience && (
            <OwnerFormField
              label="Specify Other Experience *"
              value={formData.otherExperience || ""}
              onChangeText={(value) => handleInputChange("otherExperience", value)}
              colors={colors}
              dark={dark}
              placeholder="e.g. Electrician, Delivery, etc."
            />
          )}
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
};

export default Step2JobRelatedDetails;
