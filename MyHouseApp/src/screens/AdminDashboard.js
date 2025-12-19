import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import adminStyles from "../styles/adminStyles";

export default function AdminDashboard() {
  const navigation = useNavigation();

  return (
    <View style={adminStyles.dashboardContainerCentered}>
      <View style={adminStyles.dashboardContentContainer}>
        <Text style={adminStyles.dashboardTitle}>Admin Dashboard</Text>
        <Text style={adminStyles.dashboardContent}>Welcome to the Admin Dashboard!</Text>
        <Text style={adminStyles.dashboardContent}>This is a secure admin area.</Text>
        
        <TouchableOpacity
          style={adminStyles.logoutButton}
          onPress={() => navigation.navigate("Dummy")}
        >
          <Text style={adminStyles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}