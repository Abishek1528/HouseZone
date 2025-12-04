import React from "react";
import { View, Text } from "react-native";
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
        
        <View style={{ marginTop: 20 }}>
          <Text style={categoryContentStyles.pageText}>
            Would you like to add new machinery listing?
          </Text>
          <Text 
            style={{ color: '#4A90E2', textDecorationLine: 'underline', marginTop: 10 }}
            onPress={handleAddMachinery}
          >
            Add Machinery
          </Text>
        </View>
      </View>
      
      <Footer />
    </View>
  );
}