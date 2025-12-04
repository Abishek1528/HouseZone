import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Residential() {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params || { role: "Tenant" };

  const handleAddHouse = () => {
    navigation.navigate("AddHouse", { role });
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* CONTENT */}
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Residential</Text>
        <Text style={categoryContentStyles.pageText}>This is the Residential category page.</Text>
        <Text style={categoryContentStyles.roleInfo}>Role: {role}</Text>
        
        
        {role === "Owner" && (
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleAddHouse}
          >
            <Text style={categoryContentStyles.buttonText}>Add My House</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Footer />
    </View>
  );
}