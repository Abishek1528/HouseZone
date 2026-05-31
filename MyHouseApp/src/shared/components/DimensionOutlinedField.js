import React from "react";
import { View } from "react-native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import CollapsibleFieldShell from "./CollapsibleFieldShell";
import OwnerFormField from "./OwnerFormField";

const buildSummary = (lengthVal, breadthVal) => {
  const hasLength = lengthVal != null && String(lengthVal).length > 0;
  const hasBreadth = breadthVal != null && String(breadthVal).length > 0;
  if (hasLength && hasBreadth) return `${lengthVal} × ${breadthVal} ft`;
  if (hasLength) return `${lengthVal} × … ft`;
  if (hasBreadth) return `… × ${breadthVal} ft`;
  return null;
};

const DimensionOutlinedField = ({
  label,
  lengthField,
  breadthField,
  formData,
  handleInputChange,
  colors,
  dark,
  required = false,
  collapsible = false,
}) => {
  const ofs = getOwnerFormStyles(colors, dark);
  const displayLabel = required ? `${label} *` : label;

  const lengthVal = formData[lengthField];
  const breadthVal = formData[breadthField];
  const hasLength = lengthVal != null && String(lengthVal).length > 0;
  const hasBreadth = breadthVal != null && String(breadthVal).length > 0;
  const summary = buildSummary(lengthVal, breadthVal);

  return (
    <CollapsibleFieldShell
      label={displayLabel}
      dark={dark}
      filled={hasLength && hasBreadth}
      summary={summary}
      collapsible={collapsible}
      fieldType="group"
    >
      <View style={ofs.outlinedDimRow}>
        <View style={ofs.outlinedDimHalf}>
          <OwnerFormField
            label="Length"
            value={lengthVal}
            onChangeText={(value) => handleInputChange(lengthField, value)}
            keyboardType="numeric"
            colors={colors}
            dark={dark}
            compact
          />
        </View>
        <View style={ofs.outlinedDimHalf}>
          <OwnerFormField
            label="Breadth"
            value={breadthVal}
            onChangeText={(value) => handleInputChange(breadthField, value)}
            keyboardType="numeric"
            colors={colors}
            dark={dark}
            compact
          />
        </View>
      </View>
    </CollapsibleFieldShell>
  );
};

export default DimensionOutlinedField;
