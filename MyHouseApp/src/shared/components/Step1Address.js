import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step1Address = ({ formData, handleInputChange, colors }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Address Information</Text>
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Name of the Person *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="Name of the Person"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Door No *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="Door No"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.doorNo}
          onChangeText={(value) => handleInputChange('doorNo', value)}
        />
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Street *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="Street"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.street}
          onChangeText={(value) => handleInputChange('street', value)}
        />
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Pincode *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="Pincode"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.pincode}
          onChangeText={(value) => handleInputChange('pincode', value)}
          keyboardType="numeric"
        />
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Area *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="Area"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.area}
          onChangeText={(value) => handleInputChange('area', value)}
        />
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>City *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="City"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />
        
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Contact No *</Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
          placeholder="Contact No"
          placeholderTextColor={colors?.placeholder || "#999999"}
          value={formData.contactNo}
          onChangeText={(value) => handleInputChange('contactNo', value)}
          keyboardType="phone-pad"
        />
      </View>
    </ScrollView>
  );
};

export default Step1Address;