import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Residential() {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params || { role: "Tenant" };
  const tps = getTenantPageStyles(false);

  const handleAddHouse = () => {
    navigation.navigate("AddHouse", { role });
  };
  
  const handleViewProperties = () => {
    navigation.navigate("PropertiesList");
  };

  return (
    <View style={role === "Tenant" ? tps.screen : categoryContentStyles.container}>
      <Header />
      {role === "Tenant" ? (
        <TenantPageHeader
          title="Residential"
          subtitle="Browse homes available for rent"
        />
      ) : null}
      <View style={[categoryContentStyles.content, role === "Tenant" && { paddingHorizontal: 16 }]}>
        {role !== "Tenant" ? (
          <>
            <Text style={categoryContentStyles.pageTitle}>Residential</Text>
            <Text style={categoryContentStyles.pageText}>This is the Residential category page.</Text>
            <Text style={categoryContentStyles.roleInfo}>Role: {role}</Text>
          </>
        ) : null}

        {role === "Owner" && (
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={handleAddHouse}
          >
            <Text style={categoryContentStyles.buttonText}>Add Details</Text>
          </TouchableOpacity>
        )}

        {role === "Tenant" && (
          <TouchableOpacity style={tps.btnPrimary} onPress={handleViewProperties}>
            <Text style={tps.btnText}>View Available Properties</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Footer />
    </View>
  );
}