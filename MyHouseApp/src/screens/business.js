import React from "react";
import { View, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Business() {
  const route = useRoute();
  const navigation = useNavigation();
  const { role } = route.params || { role: "Tenant" };

  const handleAddBusiness = () => {
    navigation.navigate("AddBusiness", { role });
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* CONTENT */}
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Business</Text>
        <Text style={categoryContentStyles.pageText}>This is the Business category page.</Text>
        <Text style={categoryContentStyles.roleInfo}>Role: {role}</Text>
        
        <View style={{ marginTop: 20 }}>
          <Text style={categoryContentStyles.pageText}>
            Would you like to add a new business listing?
          </Text>
          <Text 
            style={{ color: '#4A90E2', textDecorationLine: 'underline', marginTop: 10 }}
            onPress={handleAddBusiness}
          >
            Add Business
          </Text>
        </View>
      </View>
      
      <Footer />
    </View>
  );
}