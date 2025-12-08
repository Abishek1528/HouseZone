import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Vehicles() {
  const route = useRoute();
  const navigation = useNavigation();
  const { role } = route.params || { role: "Tenant" };

  const handleAddVehicles = () => {
    navigation.navigate("AddVehicles", { role });
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* CONTENT */}
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Vehicles</Text>
        <Text style={categoryContentStyles.pageText}>This is the Vehicles category page.</Text>
        <Text style={categoryContentStyles.roleInfo}>Role: {role}</Text>
        
        {role === "Owner" && (
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleAddVehicles}
          >
            <Text style={categoryContentStyles.buttonText}>Add Details</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Footer />
    </View>
  );
}