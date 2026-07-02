import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { OWNER_COLORS } from "../../styles/ownerFormStyles";

const REST_FONT = 15;
const FLOAT_FONT = 12;
const BOX_INPUT = 48;
const BOX_OPTIONS = 72;

const OutlinedFieldShell = ({
  label,
  children,
  dark = false,
  floated = false,
  filled = false,
  contentMode = "input",
  compact = false,
  error = false,
}) => {
  const progress = useRef(new Animated.Value(floated ? 1 : 0)).current;
  const labelBg = dark ? "#1f2937" : OWNER_COLORS.white;
  const boxBg = filled && !dark ? OWNER_COLORS.filledBg : dark ? "#1f2937" : "#f5f7fa";
  const borderColor = error
    ? "#ef4444"
    : filled
      ? dark
        ? OWNER_COLORS.filledBorderDark
        : OWNER_COLORS.filledBorder
      : dark
        ? "#4b5563"
        : "#bdbdbd";
  const restColor = dark ? "#9ca3af" : "#94a3b8";

  const isOptions = contentMode === "options" && floated;
  const isGroup = contentMode === "group" && floated;
  const isInput = contentMode === "input" || (!isOptions && !isGroup);

  const restLabelTop = compact ? 12 : 14;
  const floatLabelTop = -10;

  const paddingTopRange = isOptions
    ? [20, 36]
    : isGroup
      ? [20, 28]
      : [20, 26];

  const boxMinHeight = isGroup
    ? undefined
    : isOptions
      ? BOX_OPTIONS
      : BOX_INPUT;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: floated ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [floated, progress]);

  const labelTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [restLabelTop, floatLabelTop],
  });

  const labelFontSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [REST_FONT, FLOAT_FONT],
  });

  const labelColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [restColor, OWNER_COLORS.headerBg],
  });

  const chipPaddingH = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5],
  });

  const chipBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", labelBg],
  });

  const contentPaddingTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: paddingTopRange,
  });

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View
        style={[
          styles.box,
          compact && styles.boxCompact,
          {
            backgroundColor: boxBg,
            borderColor,
            borderWidth: filled ? 2 : 1,
            ...(boxMinHeight != null ? { minHeight: floated ? boxMinHeight : BOX_INPUT } : {}),
            justifyContent: isOptions ? "flex-end" : "center",
            paddingBottom: isGroup ? 6 : 8,
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.labelChip,
            {
              top: labelTop,
              paddingHorizontal: chipPaddingH,
              backgroundColor: chipBg,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.labelText,
              { fontSize: labelFontSize, color: labelColor },
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={{ paddingTop: contentPaddingTop, width: "100%", zIndex: 3 }}
        >
          <View pointerEvents="auto" style={styles.inputLayer}>
            {children}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
    marginTop: 2,
    width: "100%",
  },
  wrapCompact: {
    marginBottom: 6,
  },
  box: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    position: "relative",
  },
  boxCompact: {
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  labelChip: {
    position: "absolute",
    left: 8,
    zIndex: 2,
  },
  labelText: {
    fontWeight: "600",
  },
  inputLayer: {
    width: "100%",
  },
});

export default OutlinedFieldShell;
