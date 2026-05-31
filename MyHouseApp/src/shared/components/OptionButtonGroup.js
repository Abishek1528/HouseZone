import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OptionButtonGroup = ({
  options = [],
  selectedValue,
  onSelect,
  colors = {},
  compact = false,
  singleRow = false,
}) => {
  const text = colors.text || "#111827";
  const card = colors.card || "#f8fbff";
  const border = colors.border || "#e2e8f0";

  if (!options.length) return null;

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        singleRow && styles.containerSingleRow,
      ]}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={`${option.label}-${option.value}`}
            style={[
              styles.optionButton,
              compact && !singleRow && styles.optionButtonCompact,
              singleRow && styles.optionButtonSingleRow,
              { backgroundColor: card, borderColor: border },
              isSelected && styles.optionButtonSelected,
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.optionText,
                compact && !singleRow && styles.optionTextCompact,
                singleRow && styles.optionTextSingleRow,
                { color: isSelected ? "#fff" : text },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
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
    gap: 10,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  containerCompact: {
    marginBottom: 0,
  },
  containerSingleRow: {
    flexWrap: "nowrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    marginBottom: 0,
    paddingVertical: 6,
    width: "100%",
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fbff",
  },
  optionButtonCompact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 64,
    borderRadius: 14,
  },
  optionButtonSingleRow: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    maxWidth: "25%",
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#1e3a5f",
    borderColor: "#1e3a5f",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  optionTextCompact: {
    fontSize: 13,
  },
  optionTextSingleRow: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default OptionButtonGroup;
