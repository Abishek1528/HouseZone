import React from "react";
import { View, Text } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";
import AdminPageHeader from "../../shared/components/AdminPageHeader";

export default function LoginPage() {
  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader title="Admin Login" subtitle="Construction under progress" />
      <View style={[adminStyles.body, { justifyContent: "center", alignItems: "center", flex: 1 }]}>
        <Text style={adminStyles.dashboardContent}>Login page coming soon.</Text>
      </View>
    </View>
  );
}
