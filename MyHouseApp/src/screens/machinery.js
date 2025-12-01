import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Machinery() {
  const route = useRoute();
  const { role } = route.params || { role: "Tenant" };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* CONTENT */}
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Machinery</Text>
        <Text style={categoryContentStyles.pageText}>This is the Machinery category page.</Text>
        <Text style={categoryContentStyles.roleInfo}>Role: {role}</Text>
      </View>
      
      <Footer />
    </View>
  );
}