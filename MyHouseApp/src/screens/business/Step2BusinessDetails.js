import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import DimensionOutlinedField from "../../shared/components/DimensionOutlinedField";
import CollapsibleFieldShell from "../../shared/components/CollapsibleFieldShell";

const Step2BusinessDetails = ({ formData, handleInputChange, colors, dark }) => {
  const ofs = getOwnerFormStyles(colors, dark);

  const doorFacingOptions = [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" },
  ];

  const propertyTypeOptions = [
    { label: "Shop", value: "shop" },
    { label: "Warehouse", value: "warehouse" },
    { label: "Office", value: "office" },
    { label: "Showroom", value: "showroom" },
    { label: "Admin", value: "admin" },
  ];

  const floorOptions = [
    { label: "Ground", value: "ground" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "Basement", value: "basement" },
  ];

  const restroomSelected =
    formData.restroomAvailable === true || formData.restroomAvailable === false;
  const restroomSummary = formData.restroomAvailable === true ? "Yes" : formData.restroomAvailable === false ? "No" : null;

  const RestroomOption = ({ label, value, collapse }) => (
    <View style={ofs.restroomOption}>
      <TouchableOpacity
        style={
          formData.restroomAvailable === value
            ? ofs.restroomOuterSelected
            : ofs.restroomOuter
        }
        onPress={() => {
          handleInputChange("restroomAvailable", value);
          collapse();
        }}
      >
        {formData.restroomAvailable === value ? <View style={ofs.restroomInner} /> : null}
      </TouchableOpacity>
      <Text style={ofs.restroomLabel}>{label}</Text>
    </View>
  );

  return (
    <OwnerFormCard
      title="Business Details"
      subtitle="Space layout and facilities"
      colors={colors}
      dark={dark}
    >
        <OptionSelectField
          label="Door Facing *"
          options={doorFacingOptions}
          selectedValue={formData.doorFacing || ""}
          onSelect={(value) => handleInputChange("doorFacing", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <OptionSelectField
          label="Property Type *"
          options={propertyTypeOptions}
          selectedValue={formData.propertyType || ""}
          onSelect={(value) => handleInputChange("propertyType", value)}
          colors={colors}
          dark={dark}
          collapsible
        />

        <DimensionOutlinedField
          label="Total Area"
          lengthField="areaLength"
          breadthField="areaBreadth"
          formData={formData}
          handleInputChange={handleInputChange}
          colors={colors}
          dark={dark}
          required
          collapsible
        />

        <CollapsibleFieldShell
          label="Restroom Available? *"
          dark={dark}
          filled={restroomSelected}
          summary={restroomSummary}
          collapsible
          fieldType="options"
        >
          {({ collapse }) => (
            <View style={ofs.restroomRow}>
              <RestroomOption label="Yes" value={true} collapse={collapse} />
              <RestroomOption label="No" value={false} collapse={collapse} />
            </View>
          )}
        </CollapsibleFieldShell>

        <OptionSelectField
          label="Floor Number *"
          options={floorOptions}
          selectedValue={formData.floorNumber || ""}
          onSelect={(value) => handleInputChange("floorNumber", value)}
          colors={colors}
          dark={dark}
          collapsible
        />
      </OwnerFormCard>
  );
};

export default Step2BusinessDetails;
