import React from "react";
import { View, Text } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";

const AdminPageHeader = ({ title, subtitle }) => (
  <View style={adminStyles.pageHeader}>
    <Text style={adminStyles.pageHeaderTitle}>{title}</Text>
    {subtitle ? <Text style={adminStyles.pageHeaderSubtitle}>{subtitle}</Text> : null}
  </View>
);

export default AdminPageHeader;
