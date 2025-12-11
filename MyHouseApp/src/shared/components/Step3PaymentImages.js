import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step3PaymentImages = ({ formData, handleInputChange }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Payment Details</Text>
        
        {/* Payment Details */}
        <Text style={categoryContentStyles.label}>Advance Amount (₹) *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Advance Amount"
          value={formData.advanceAmount}
          onChangeText={(value) => handleInputChange('advanceAmount', value)}
          keyboardType="numeric"
        />
        
        <Text style={categoryContentStyles.label}>Monthly Rent (₹) *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Monthly Rent"
          value={formData.rentAmount}
          onChangeText={(value) => handleInputChange('rentAmount', value)}
          keyboardType="numeric"
        />
        
        {/* Note about removed image functionality */}
        <Text style={[categoryContentStyles.pageText, { textAlign: 'center', marginTop: 30, fontStyle: 'italic' }]}>
          Image upload functionality has been temporarily removed
        </Text>
      </View>
    </ScrollView>
  );
};

export default Step3PaymentImages;