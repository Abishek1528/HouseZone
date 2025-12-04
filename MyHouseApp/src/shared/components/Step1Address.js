import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step1Address = ({ formData, handleInputChange }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Address Information</Text>
        
        <Text style={categoryContentStyles.label}>Name of the Person *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Name of the Person"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        
        <Text style={categoryContentStyles.label}>Door No *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Door No"
          value={formData.doorNo}
          onChangeText={(value) => handleInputChange('doorNo', value)}
        />
        
        <Text style={categoryContentStyles.label}>Street *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Street"
          value={formData.street}
          onChangeText={(value) => handleInputChange('street', value)}
        />
        
        <Text style={categoryContentStyles.label}>Pincode *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Pincode"
          value={formData.pincode}
          onChangeText={(value) => handleInputChange('pincode', value)}
          keyboardType="numeric"
        />
        
        <Text style={categoryContentStyles.label}>Area *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Area"
          value={formData.area}
          onChangeText={(value) => handleInputChange('area', value)}
        />
        
        <Text style={categoryContentStyles.label}>City *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="City"
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />
        
        <Text style={categoryContentStyles.label}>Contact No *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Contact No"
          value={formData.contactNo}
          onChangeText={(value) => handleInputChange('contactNo', value)}
          keyboardType="phone-pad"
        />
      </View>
    </ScrollView>
  );
};

export default Step1Address;