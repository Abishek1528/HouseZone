import React from "react";
import { View, Text } from "react-native";
import OptionButtonGroup from "./OptionButtonGroup";
import { tenantListStyles } from "../../styles/tenantPageStyles";

/**
 * Full-width filter card for tenant listing screens.
 * Each section: label + wrapping option chips (no outlined form shell).
 */
const TenantFilterPanel = ({ title = null, sections = [], colors }) => {
  if (!sections.length) return null;

  return (
    <View style={tenantListStyles.filterPanel}>
      {title ? <Text style={tenantListStyles.filterPanelTitle}>{title}</Text> : null}
      {sections.map((section, index) => (
        <View key={section.key || section.label || index}>
          {index > 0 ? <View style={tenantListStyles.filterDivider} /> : null}
          <View style={tenantListStyles.filterSection}>
            <Text style={tenantListStyles.filterSectionLabel}>
              {String(section.label || "").replace(/:$/, "")}
            </Text>
            <OptionButtonGroup
              options={section.options}
              selectedValue={section.value}
              onSelect={section.onSelect}
              colors={colors}
              layout="filter"
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default TenantFilterPanel;
