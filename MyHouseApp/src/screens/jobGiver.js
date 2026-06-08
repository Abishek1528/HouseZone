import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function JobGiver() {
  const navigation = useNavigation();

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Job Givers</Text>
        <Text style={categoryContentStyles.pageText}>
          Post jobs for your local shop and find workers nearby.
        </Text>
        <TouchableOpacity
          style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
          onPress={() => navigation.navigate("AddJobGiver")}
        >
          <Text style={categoryContentStyles.buttonText}>Post Job Details</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}
