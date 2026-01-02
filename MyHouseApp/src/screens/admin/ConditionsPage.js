import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import categoryContentStyles from "../../styles/categoryContentStyles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ConditionsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { ownerData, formData, refreshOwners } = route.params || {};
  
  const [conditions, setConditions] = useState({
    condition1: false,
    condition2: false,
    condition3: false,
    condition4: false,
    condition5: false,
    condition6: false,
  });

  const predefinedConditions = [
    'No structural changes without owner’s permission.',
    'Water and electricity bills must be paid by the tenant.',
    'Advance/deposit amount is non-refundable.',
    'No damage to property, repair costs will be deducted from the deposit.',
    'Pets are not allowed on the premises.',
    'Only Vegetarian.'
  ];

  const handleConditionToggle = (field) => {
    setConditions(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdateConditions = async () => {
    // Validate that at least one condition is selected
    const selectedConditions = Object.values(conditions).filter(value => value === true);
    
    if (selectedConditions.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one condition');
      return;
    }

    // If there's location amenities data to save, save it first
    if (formData) {
      try {
        // Prepare the data to send to the API
        const locationData = {
          roNo: ownerData.id,
          streetSizeBreadth: formData.streetSizeBreadth,
          nearbyBusStop: formData.nearbyBusStop,
          busStopDistance: formData.busStopDistance,
          nearbySchool: formData.nearbySchool,
          schoolDistance: formData.schoolDistance,
          nearbyShoppingMall: formData.nearbyShoppingMall,
          shoppingMallDistance: formData.shoppingMallDistance,
          nearbyBank: formData.nearbyBank,
          bankDistance: formData.bankDistance
        };
        
        // Use the same API base URL pattern as other components
        const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
        
        // Call the API to update location & amenities
        const locationResponse = await fetch(`${API_BASE_URL}/residential/location-amenities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationData)
        });
        
        const locationResult = await locationResponse.json();
        
        if (!locationResponse.ok) {
          Alert.alert('Error', locationResult.message || 'Failed to update location & amenities details');
          return;
        }
      } catch (error) {
        console.error('Error updating location & amenities details:', error);
        Alert.alert('Error', 'Failed to update location & amenities details. Please try again.');
        return;
      }
    }

    // Now save the selected conditions
    try {
      // Convert selected conditions to an array of numbers (1-6)
      const conditionNumbers = [];
      if (conditions.condition1) conditionNumbers.push(1);
      if (conditions.condition2) conditionNumbers.push(2);
      if (conditions.condition3) conditionNumbers.push(3);
      if (conditions.condition4) conditionNumbers.push(4);
      if (conditions.condition5) conditionNumbers.push(5);
      if (conditions.condition6) conditionNumbers.push(6);

      const conditionsData = {
        roNo: ownerData.id,
        conditionNumbers: conditionNumbers
      };

      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

      // Call the API to save conditions
      const conditionsResponse = await fetch(`${API_BASE_URL}/residential/conditions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conditionsData)
      });

      const conditionsResult = await conditionsResponse.json();

      if (!conditionsResponse.ok) {
        Alert.alert('Error', conditionsResult.message || 'Failed to update conditions');
        return;
      }
    } catch (error) {
      console.error('Error updating conditions:', error);
      Alert.alert('Error', 'Failed to update conditions. Please try again.');
      return;
    }

    // Show success message
    Alert.alert(
      'Success',
      'Conditions and location amenities updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // If refreshOwners callback exists, call it to refresh the data
            if (refreshOwners && typeof refreshOwners === 'function') {
              refreshOwners();
            }
            // Navigate back to the previous page
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Conditions</Text>
        <Text style={categoryContentStyles.pageText}>Please select the applicable conditions for the property</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Condition 1 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition1')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition1 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition1 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[0]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 2 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition2')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition2 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition2 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[1]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 3 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition3')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition3 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition3 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[2]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 4 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition4')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition4 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition4 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[3]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 5 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition5')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition5 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition5 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[4]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 6 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition6')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition6 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition6 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[5]}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={categoryContentStyles.buttonRow}>
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
              onPress={handleGoBack}
            >
              <Text style={categoryContentStyles.buttonText}>Back</Text>
            </TouchableOpacity>
            
            <View style={{ flex: 1 }} />
            
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
              onPress={handleUpdateConditions}
            >
              <Text style={categoryContentStyles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      <Footer />
    </View>
  );
}