import React from "react";
import { View } from "react-native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import DimensionOutlinedField from "../../shared/components/DimensionOutlinedField";

const DIRECTION_OPTIONS = [
  { label: "North", value: "North" },
  { label: "South", value: "South" },
  { label: "East", value: "East" },
  { label: "West", value: "West" },
];

const COUNT_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];

const BATHROOM_ACCESS_OPTIONS = [
  { label: "Common", value: "Common" },
  { label: "Attached", value: "Attached" },
];

const BATHROOM_TYPE_OPTIONS = [
  { label: "Indian", value: "Indian" },
  { label: "Western", value: "Western" },
];

const FLOOR_OPTIONS = [
  { label: "Ground Floor", value: "Ground Floor" },
  { label: "1st Floor", value: "1st Floor" },
  { label: "2nd Floor", value: "2nd Floor" },
  { label: "3rd Floor", value: "3rd Floor" },
];

const PARKING_4W_OPTIONS = [
  { label: "No", value: "No" },
  { label: "Yes", value: "Yes" },
];

const Step2Details = ({ formData, handleInputChange, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);

  return (
    <OwnerFormCard
      title="House Details"
      subtitle="Property layout and amenities"
      colors={colors}
      dark={dark}
    >
        <OptionSelectField
          label="Facing Direction *"
          options={DIRECTION_OPTIONS}
          selectedValue={formData.facingDirection}
          onSelect={(value) => handleInputChange("facingDirection", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <DimensionOutlinedField
          label="Hall Dimensions (feet)"
          lengthField="hallLength"
          breadthField="hallBreadth"
          formData={formData}
          handleInputChange={handleInputChange}
          colors={colors}
          dark={dark}
          required
          collapsible
        />

        <OptionSelectField
          label="Number of Bedrooms *"
          options={COUNT_OPTIONS}
          selectedValue={formData.noOfBedrooms}
          onSelect={(value) => handleInputChange("noOfBedrooms", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <DimensionOutlinedField
          label="Bedroom 1 Dimensions (feet)"
          lengthField="bedroom1Length"
          breadthField="bedroom1Breadth"
          formData={formData}
          handleInputChange={handleInputChange}
          colors={colors}
          dark={dark}
          required
          collapsible
        />

        {parseInt(formData.noOfBedrooms, 10) >= 2 && (
          <DimensionOutlinedField
            label="Bedroom 2 Dimensions (feet)"
            lengthField="bedroom2Length"
            breadthField="bedroom2Breadth"
            formData={formData}
            handleInputChange={handleInputChange}
            colors={colors}
            dark={dark}
            collapsible
          />
        )}

        {parseInt(formData.noOfBedrooms, 10) >= 3 && (
          <DimensionOutlinedField
            label="Bedroom 3 Dimensions (feet)"
            lengthField="bedroom3Length"
            breadthField="bedroom3Breadth"
            formData={formData}
            handleInputChange={handleInputChange}
            colors={colors}
            dark={dark}
            collapsible
          />
        )}

        <DimensionOutlinedField
          label="Kitchen Dimensions (feet)"
          lengthField="kitchenLength"
          breadthField="kitchenBreadth"
          formData={formData}
          handleInputChange={handleInputChange}
          colors={colors}
          dark={dark}
          required
          collapsible
        />

        <OptionSelectField
          label="Number of Bathrooms *"
          options={COUNT_OPTIONS}
          selectedValue={formData.noOfBathrooms}
          onSelect={(value) => handleInputChange("noOfBathrooms", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <OptionSelectField
          label="Bathroom 1 Access *"
          options={BATHROOM_ACCESS_OPTIONS}
          selectedValue={formData.bathroom1Access}
          onSelect={(value) => handleInputChange("bathroom1Access", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <OptionSelectField
          label="Bathroom 1 Type *"
          options={BATHROOM_TYPE_OPTIONS}
          selectedValue={formData.bathroom1Type}
          onSelect={(value) => handleInputChange("bathroom1Type", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        {parseInt(formData.noOfBathrooms, 10) >= 2 && (
          <>
            <OptionSelectField
              label="Bathroom 2 Access"
              options={BATHROOM_ACCESS_OPTIONS}
              selectedValue={formData.bathroom2Access}
              onSelect={(value) => handleInputChange("bathroom2Access", value)}
              colors={colors}
              dark={dark}
              collapsible
            />
            <OptionSelectField
              label="Bathroom 2 Type"
              options={BATHROOM_TYPE_OPTIONS}
              selectedValue={formData.bathroom2Type}
              onSelect={(value) => handleInputChange("bathroom2Type", value)}
              colors={colors}
              dark={dark}
              collapsible
            />
          </>
        )}

        {parseInt(formData.noOfBathrooms, 10) >= 3 && (
          <>
            <OptionSelectField
              label="Bathroom 3 Access"
              options={BATHROOM_ACCESS_OPTIONS}
              selectedValue={formData.bathroom3Access}
              onSelect={(value) => handleInputChange("bathroom3Access", value)}
              colors={colors}
              dark={dark}
              collapsible
            />
            <OptionSelectField
              label="Bathroom 3 Type"
              options={BATHROOM_TYPE_OPTIONS}
              selectedValue={formData.bathroom3Type}
              onSelect={(value) => handleInputChange("bathroom3Type", value)}
              colors={colors}
              dark={dark}
              collapsible
            />
          </>
        )}

        <View style={ofs.divider} />

        <OptionSelectField
          label="Floor Number *"
          options={FLOOR_OPTIONS}
          selectedValue={formData.floorNo}
          onSelect={(value) => handleInputChange("floorNo", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <OptionSelectField
          label="Parking (2-Wheeler)"
          options={COUNT_OPTIONS}
          selectedValue={formData.parking2Wheeler}
          onSelect={(value) => handleInputChange("parking2Wheeler", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <OptionSelectField
          label="Parking (4-Wheeler)"
          options={PARKING_4W_OPTIONS}
          selectedValue={formData.parking4Wheeler}
          onSelect={(value) => handleInputChange("parking4Wheeler", value)}
          colors={colors}
          dark={dark}
          collapsible
        />
    </OwnerFormCard>
  );
};

export default Step2Details;
