import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import adminStyles from "../../styles/admin/adminStyles";
import AdminPageHeader from "../../shared/components/AdminPageHeader";

export default function AdminDashboard() {
  const navigation = useNavigation();

  const buttons = [
    { label: "Signup", target: "SignupPage" },
    { label: "Login", target: "LoginPage" },
    { label: "Residential Owner", target: "ResidentialOwnerPage" },
    { label: "Residential Tenant", target: "ResidentialTenantPage" },
    { label: "Business Owner", target: "BusinessOwnerPage" },
    { label: "Business Tenant", target: "BusinessTenantPage" },
    { label: "Vehicles Owner", target: "VehiclesOwnerPage" },
    { label: "Vehicles Tenant", target: "VehiclesTenantPage" },
    { label: "Machinery Owner", target: "MachineryOwnerPage" },
    { label: "Machinery Tenant", target: "MachineryTenantPage" },
  ];

  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader
        title="Admin Dashboard"
        subtitle="Manage owners, tenants, and signups"
      />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={adminStyles.dashboardScrollCentered}
        showsVerticalScrollIndicator={false}
      >
        <View style={adminStyles.buttonsGrid}>
          {buttons.map((button) => (
            <TouchableOpacity
              key={button.target}
              style={adminStyles.dashboardButton}
              onPress={() => navigation.navigate(button.target)}
            >
              <Text style={adminStyles.btnText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={adminStyles.logoutButton} onPress={() => navigation.navigate("Dummy")}>
          <Text style={adminStyles.btnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
