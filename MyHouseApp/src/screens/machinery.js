import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Machinery() {
  const route = useRoute();
  const navigation = useNavigation();
  const { role } = route.params || { role: "Tenant" };

  const handleAddMachinery = () => {
    navigation.navigate("AddMachinery", { role });
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* CONTENT */}
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Machinery</Text>
        <Text style={categoryContentStyles.pageText}>This is the Machinery category page.</Text>
        
        {role === "Owner" && (
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleAddMachinery}
          >
            <Text style={categoryContentStyles.buttonText}>Add Details</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Footer />
    </View>
  );
}