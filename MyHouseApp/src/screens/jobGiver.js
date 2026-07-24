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
      <View style={[categoryContentStyles.content, { justifyContent: 'space-between' }]}>
        <View style={{ alignItems: 'center', width: '100%' }}>
          <Text style={categoryContentStyles.pageTitle}>Job Givers</Text>
          <Text style={categoryContentStyles.pageText}>
            Post jobs for your local shop and find workers nearby.
          </Text>
        </View>
        <View style={[categoryContentStyles.buttonRow, { marginBottom: 0 }]}>
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={() => navigation.navigate("AddJobGiver")}
          >
            <Text style={categoryContentStyles.buttonText}>Register Your Company</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.secondaryButton]}
            onPress={() => navigation.navigate("JobGiverJobSeekers")}
          >
            <Text style={categoryContentStyles.buttonText}>View All Employers</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}
