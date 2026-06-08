import React from "react";
import { View, Text } from "react-native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function JobGiver() {
  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Job Givers</Text>
        <Text style={categoryContentStyles.pageText}>
          Post jobs and find candidates for your openings.
        </Text>
      </View>
      <Footer />
    </View>
  );
}
