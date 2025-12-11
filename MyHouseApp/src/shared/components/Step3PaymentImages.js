import React from "react";
<<<<<<< Updated upstream
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step3PaymentImages = ({ formData, handleInputChange, handleImageSelect, handleRemoveImage }) => {
=======
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step3PaymentImages = ({ formData, handleInputChange, handleImageSelect, handleRemoveImage }) => {
  // Request permission for camera or gallery access
  const requestPermission = async (permissionType) => {
    try {
      let permissionResult;
      
      if (permissionType === 'camera') {
        // For camera permission
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        // For gallery permission
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      
      if (permissionResult.granted) {
        return true;
      } else {
        Alert.alert(
          'Permission Denied', 
          `Permission to access ${permissionType} is required to select images. Please enable it in settings.`
        );
        return false;
      }
    } catch (error) {
      console.log('Permission error:', error);
      Alert.alert('Error', 'Failed to request permission. Please try again.');
      return false;
    }
  };

  // Handle image selection from camera or gallery
  const selectImage = async (source) => {
    try {
      // Request appropriate permission
      const hasPermission = await requestPermission(source === 'camera' ? 'camera' : 'gallery');
      
      if (!hasPermission) {
        return;
      }
      
      let result;
      
      if (source === 'camera') {
        // Launch camera
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
          aspect: [4, 3],
        });
      } else {
        // Launch image library
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsMultipleSelection: true,
          orderedSelection: true,
        });
      }
      
      handleImageResponse(result);
    } catch (error) {
      console.log('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Handle image response from camera or gallery
  const handleImageResponse = (result) => {
    console.log('Image picker result:', result);
    
    if (result.canceled) {
      console.log('User cancelled image picker');
      return;
    }
    
    if (result.assets && result.assets.length > 0) {
      // For multiple selection, we might get several assets
      const imageUris = result.assets.map(asset => asset.uri);
      
      // Add each selected image
      imageUris.forEach(uri => {
        handleImageSelect(uri);
      });
    } else {
      console.log('No image selected');
      Alert.alert('Error', 'No image was selected. Please try again.');
    }
  };

  // Check if we've reached the maximum number of images
  const images = formData.images || [];
  const isMaxImages = images.length >= 7;

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
        <Text style={[categoryContentStyles.formTitle, { marginTop: 30 }]}>Property Images</Text>
        <Text style={categoryContentStyles.pageText}>
          Add 4-7 images of your property (minimum 4 required)
        </Text>
        
        {/* Image Selection Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { flex: 0.4 }]}
            onPress={() => selectImage('camera')}
            disabled={isMaxImages}
          >
            <Text style={categoryContentStyles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { flex: 0.4 }]}
            onPress={() => selectImage('gallery')}
            disabled={isMaxImages}
          >
            <Text style={categoryContentStyles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        
        {/* Selected Images Preview */}
        {images.length > 0 && (
          <View style={{ marginVertical: 20 }}>
            <Text style={categoryContentStyles.label}>Selected Images ({images.length}/7)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {images.map((imageUri, index) => (
                <View key={index} style={{ width: '30%', marginBottom: 10 }}>
                  <Image 
                    source={{ uri: imageUri }} 
                    style={{ width: '100%', height: 100, borderRadius: 5 }}
                  />
                  <TouchableOpacity 
                    style={{ 
                      position: 'absolute', 
                      top: 5, 
                      right: 5, 
                      backgroundColor: 'red', 
                      borderRadius: 10, 
                      width: 20, 
                      height: 20, 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Image Requirements */}
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Image Guidelines:</Text>
          <Text>• Minimum 4 images required</Text>
          <Text>• Maximum 7 images allowed</Text>
          <Text>• Include exterior, interior, and key rooms</Text>
          <Text>• Clear, well-lit photos work best</Text>
>>>>>>> Stashed changes
        </View>
      </View>
    </ScrollView>
  );
};

export default Step3PaymentImages;