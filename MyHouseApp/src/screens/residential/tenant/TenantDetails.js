import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { saveTenantDetails } from './api';

const TenantDetails = () => {
  const navigation = useNavigation();
  const [tenantData, setTenantData] = useState({
    name: '',
    job: '',
    salary: '',
    nativePlace: '',
    currentAddress: '',
    mobileNumber: '',
    alternateNumber: ''
  });

  const handleInputChange = (field, value) => {
    setTenantData({
      ...tenantData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!tenantData.name || !tenantData.job || !tenantData.salary || 
        !tenantData.nativePlace || !tenantData.mobileNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Validate salary is a number
    if (isNaN(tenantData.salary) || parseFloat(tenantData.salary) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid salary amount');
      return;
    }

    // Validate mobile numbers
    if (isNaN(tenantData.mobileNumber) || tenantData.mobileNumber.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid mobile number');
      return;
    }

    if (tenantData.alternateNumber && (isNaN(tenantData.alternateNumber) || tenantData.alternateNumber.length < 10)) {
      Alert.alert('Validation Error', 'Please enter a valid alternate number');
      return;
    }

    // Save tenant data to backend
    try {
      const tenantDetails = {
        tenant_name: tenantData.name,
        job: tenantData.job,
        salary: tenantData.salary,
        native_place: tenantData.nativePlace,
        current_address: tenantData.currentAddress,
        mobile_number: tenantData.mobileNumber,
        alternate_number: tenantData.alternateNumber || null
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
      Alert.alert('Error', `Failed to save tenant details: ${error.message || 'Network connection failed. Please check your internet connection and backend server status.'}`);
    }
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <ScrollView style={{ width: '100%' }}>
          <View style={categoryContentStyles.formContainer}>
            <Text style={categoryContentStyles.formTitle}>Tenant Details</Text>
            
            <Text style={categoryContentStyles.label}>Name *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Full Name"
              value={tenantData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            
            <Text style={categoryContentStyles.label}>Job *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Occupation"
              value={tenantData.job}
              onChangeText={(value) => handleInputChange('job', value)}
            />
            
            <Text style={categoryContentStyles.label}>Salary per Month *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Monthly Salary"
              value={tenantData.salary}
              onChangeText={(value) => handleInputChange('salary', value)}
              keyboardType="numeric"
            />
            
            <Text style={categoryContentStyles.label}>Native Place *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Native Place"
              value={tenantData.nativePlace}
              onChangeText={(value) => handleInputChange('nativePlace', value)}
            />
            
            <Text style={categoryContentStyles.label}>Current Address</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Current Address"
              value={tenantData.currentAddress}
              onChangeText={(value) => handleInputChange('currentAddress', value)}
              multiline={true}
              numberOfLines={3}
            />
            
            <Text style={categoryContentStyles.label}>Mobile Number *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Mobile Number"
              value={tenantData.mobileNumber}
              onChangeText={(value) => handleInputChange('mobileNumber', value)}
              keyboardType="phone-pad"
            />
            
            <Text style={categoryContentStyles.label}>Alternate Number</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Alternate Number"
              value={tenantData.alternateNumber}
              onChangeText={(value) => handleInputChange('alternateNumber', value)}
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>
        
        <View style={categoryContentStyles.buttonRow}>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={categoryContentStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={handleSubmit}
          >
            <Text style={categoryContentStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
};

export default TenantDetails;