import React from "react";
import { View, Text } from "react-native";
import categoryContentStyles from '../styles/categoryContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function JobSeeker() {
  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Job Seeker</Text>
        <Text style={categoryContentStyles.pageText}>
          Browse and apply for job opportunities.
        </Text>
      </View>
      <Footer />
    </View>
  );
}
