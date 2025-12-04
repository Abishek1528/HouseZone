import React from "react";
import { View, Text, ScrollView } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step2BusinessDetails = () => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Business Details</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A90E2' }}>
            Construction Under Progress
          </Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 10, textAlign: 'center' }}>
            This section is currently under development. Please check back later.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Step2BusinessDetails;