import React from "react";
import { View, Text } from "react-native";
import { tenantListStyles } from "../../styles/tenantPageStyles";

const TenantPageHeader = ({ title, subtitle }) => (
  <View style={tenantListStyles.pageHeader}>
    <Text style={tenantListStyles.pageHeaderTitle}>{title}</Text>
    {subtitle ? (
      <Text style={tenantListStyles.pageHeaderSubtitle}>{subtitle}</Text>
    ) : null}
  </View>
);

export default TenantPageHeader;
