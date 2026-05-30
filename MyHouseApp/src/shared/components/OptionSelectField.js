import React from "react";
import { View, Text } from "react-native";
import categoryContentStyles from "../../styles/categoryContentStyles";
import OptionButtonGroup from "./OptionButtonGroup";

const OptionSelectField = ({
  label,
  options,
  selectedValue,
  onSelect,
  colors,
  compact = false,
}) => (
  <View style={{ marginBottom: compact ? 8 : 0 }}>
    {label ? (
      <Text style={[categoryContentStyles.label, { color: colors?.text || "#000" }]}>
        {label}
      </Text>
    ) : null}
    <OptionButtonGroup
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
      colors={colors}
      compact={compact}
    />
  </View>
);

export default OptionSelectField;
