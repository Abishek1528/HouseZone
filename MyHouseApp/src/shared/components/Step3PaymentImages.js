import React from "react";
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step3PaymentImages = ({ formData, handleInputChange, handleImageSelect, handleRemoveImage }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>Payment Details & House Images</Text>
        
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
        
        {/* Image Upload Section */}
        <Text style={[categoryContentStyles.label, { marginTop: 20 }]}>Upload House Images *</Text>
        <Text style={[categoryContentStyles.pageText, { textAlign: 'left', marginBottom: 15 }]}>
          Please upload between 4 and 8 images of your house
        </Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Display existing images */}
          {formData.images.map((imageUri, index) => (
            <View key={index} style={{ width: '30%', marginBottom: 15 }}>
              <TouchableOpacity 
                style={{
                  height: 100,
                  borderWidth: 1,
                  borderColor: '#4A90E2',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f9f9f9'
                }}
                onPress={() => handleImageSelect(index)}
              >
                <Image 
                  source={{ uri: imageUri }} 
                  style={{ width: '100%', height: '100%', borderRadius: 5 }} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ 
                  backgroundColor: '#ff4444', 
                  padding: 5, 
                  borderRadius: 3, 
                  marginTop: 3,
                  alignItems: 'center'
                }}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={{ color: 'white', fontSize: 10 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {/* Add new image button - only show if less than 8 images */}
          {formData.images.length < 8 && (
            <View style={{ width: '30%', marginBottom: 15 }}>
              <TouchableOpacity 
                style={{
                  height: 100,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f9f9f9'
                }}
                onPress={() => handleImageSelect(formData.images.length)}
              >
                <Text style={{ color: '#4A90E2', fontSize: 30 }}>+</Text>
                <Text style={{ color: '#999', textAlign: 'center', fontSize: 12 }}>Add Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
            {formData.images.length} image(s) uploaded (Between 4 and 8 required)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Step3PaymentImages;