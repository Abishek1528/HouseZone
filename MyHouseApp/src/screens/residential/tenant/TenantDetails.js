import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { saveTenantDetails } from './api';
import { useTheme } from '../../../context/ThemeContext';

const TenantDetails = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [tenantData, setTenantData] = useState({
    name: '',
    job: '',
    salary: '',
    nativePlace: '',
    currentAddress: '',
    mobileNumber: '',
    alternateNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setTenantData({
      ...tenantData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!tenantData.name?.trim() || !tenantData.job?.trim() || !tenantData.salary?.trim() || 
        !tenantData.nativePlace?.trim() || !tenantData.mobileNumber?.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Validate salary is a number
    const salaryNum = parseFloat(tenantData.salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid salary amount');
      return;
    }

    // Validate mobile numbers
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(tenantData.mobileNumber.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (tenantData.alternateNumber?.trim() && !phoneRegex.test(tenantData.alternateNumber.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit alternate number');
      return;
    }

    setIsSubmitting(true);
    // Save tenant data to backend
    try {
      const tenantDetails = {
        tenant_name: tenantData.name.trim(),
        job: tenantData.job.trim(),
        salary: salaryNum,
        native_place: tenantData.nativePlace.trim(),
        current_address: tenantData.currentAddress.trim(),
        mobile_number: tenantData.mobileNumber.trim(),
        alternate_number: tenantData.alternateNumber?.trim() || null
      };
      
      await saveTenantDetails(tenantDetails);
      
      // Show success message
      Alert.alert(
        'Success',
        'Tenant details submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error saving tenant details:', error);
      Alert.alert('Error', `Failed to save tenant details: ${error.message || 'Network connection failed.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = [
    categoryContentStyles.input, 
    { 
      backgroundColor: colors.card, 
      color: colors.text, 
      borderColor: colors.border 
    }
  ];

  return (
    <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={categoryContentStyles.content}>
          <ScrollView 
            style={{ width: '100%' }}
            showsVerticalScrollIndicator={false}
          >
            <View style={[categoryContentStyles.formContainer, { borderColor: colors.primary, backgroundColor: colors.card }]}>
              <Text style={[categoryContentStyles.formTitle, { color: colors.primary }]}>Tenant Details</Text>
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Name *</Text>
              <TextInput
                style={inputStyle}
                placeholder="Full Name"
                placeholderTextColor={colors.placeholder}
                value={tenantData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                editable={!isSubmitting}
              />
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Job *</Text>
              <TextInput
                style={inputStyle}
                placeholder="Occupation"
                placeholderTextColor={colors.placeholder}
                value={tenantData.job}
                onChangeText={(value) => handleInputChange('job', value)}
                editable={!isSubmitting}
              />
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Salary per Month *</Text>
              <TextInput
                style={inputStyle}
                placeholder="Monthly Salary"
                placeholderTextColor={colors.placeholder}
                value={tenantData.salary}
                onChangeText={(value) => handleInputChange('salary', value)}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Native Place *</Text>
              <TextInput
                style={inputStyle}
                placeholder="Native Place"
                placeholderTextColor={colors.placeholder}
                value={tenantData.nativePlace}
                onChangeText={(value) => handleInputChange('nativePlace', value)}
                editable={!isSubmitting}
              />
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Current Address</Text>
              <TextInput
                style={[inputStyle, { height: 80, textAlignVertical: 'top', paddingVertical: 10 }]}
                placeholder="Current Address"
                placeholderTextColor={colors.placeholder}
                value={tenantData.currentAddress}
                onChangeText={(value) => handleInputChange('currentAddress', value)}
                multiline={true}
                numberOfLines={3}
                editable={!isSubmitting}
              />
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Mobile Number *</Text>
              <TextInput
                style={inputStyle}
                placeholder="Mobile Number"
                placeholderTextColor={colors.placeholder}
                value={tenantData.mobileNumber}
                onChangeText={(value) => handleInputChange('mobileNumber', value)}
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
              
              <Text style={[categoryContentStyles.label, { color: colors.text }]}>Alternate Number</Text>
              <TextInput
                style={inputStyle}
                placeholder="Alternate Number"
                placeholderTextColor={colors.placeholder}
                value={tenantData.alternateNumber}
                onChangeText={(value) => handleInputChange('alternateNumber', value)}
                keyboardType="phone-pad"
                editable={!isSubmitting}
              />
            </View>
          </ScrollView>
          
          <View style={categoryContentStyles.buttonRow}>
            <TouchableOpacity 
              style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
            >
              <Text style={categoryContentStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                categoryContentStyles.button, 
                categoryContentStyles.primaryButton,
                { backgroundColor: colors.primary },
                isSubmitting && { opacity: 0.7 }
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={categoryContentStyles.buttonText}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      <Footer />
    </View>
  );
};

export default TenantDetails;