import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * Button-style option selector. Selected option is highlighted with primary color.
 */
const OptionButtonGroup = ({
  options = [],
  selectedValue,
  onSelect,
  colors = {},
  compact = false,
}) => {
  const primary = colors.primary || "#4A90E2";
  const text = colors.text || "#000";
  const card = colors.card || "#fff";
  const border = colors.border || "#4A90E2";

  if (!options.length) return null;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={`${option.label}-${option.value}`}
            style={[
              styles.optionButton,
              compact && styles.optionButtonCompact,
              { backgroundColor: card, borderColor: border },
              isSelected && { backgroundColor: primary, borderColor: primary },
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.optionText,
                compact && styles.optionTextCompact,
                { color: isSelected ? "#fff" : text },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  containerCompact: {
    marginBottom: 8,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    minWidth: 72,
    alignItems: "center",
  },
  optionButtonCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 64,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionTextCompact: {
    fontSize: 13,
  },
});

export default OptionButtonGroup;
