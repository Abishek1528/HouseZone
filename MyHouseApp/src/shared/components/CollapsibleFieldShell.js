import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import OutlinedFieldShell from "./OutlinedFieldShell";
import { OWNER_COLORS } from "../../styles/ownerFormStyles";

const renderChildContent = (children, collapse) => {
  if (typeof children === "function") {
    return children({ collapse });
  }
  return children;
};

/**
 * Collapsed: shows only the label (and optional summary when filled).
 * Tap to expand and reveal field content.
 */
const CollapsibleFieldShell = ({
  label,
  dark = false,
  filled = false,
  summary = null,
  collapsible = true,
  fieldType = "options",
  children,
}) => {
  const [expanded, setExpanded] = useState(false);
  const collapse = () => setExpanded(false);

  if (!collapsible) {
    return (
      <OutlinedFieldShell
        label={label}
        dark={dark}
        floated={filled}
        filled={filled}
        contentMode={fieldType === "group" ? "group" : fieldType}
      >
        {renderChildContent(children, collapse)}
      </OutlinedFieldShell>
    );
  }

  const floated = expanded || filled;
  const showContent = expanded;
  const contentMode = showContent ? (fieldType === "group" ? "group" : fieldType) : "input";

  const shell = (
    <OutlinedFieldShell
      label={label}
      dark={dark}
      floated={floated}
      filled={filled}
      contentMode={contentMode}
    >
      {showContent
        ? renderChildContent(children, collapse)
        : summary
          ? <Text style={styles.summary}>{summary}</Text>
          : null}
    </OutlinedFieldShell>
  );

  if (expanded) {
    return <View style={styles.expandedWrap}>{shell}</View>;
  }

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={() => setExpanded(true)}>
      {shell}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  expandedWrap: {
    width: "100%",
  },
  summary: {
    fontSize: 15,
    fontWeight: "600",
    color: OWNER_COLORS.headerBgAlt,
    paddingTop: 8,
    textAlign: "left",
  },
});

export default CollapsibleFieldShell;
