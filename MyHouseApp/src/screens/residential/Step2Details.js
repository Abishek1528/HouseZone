import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step2Details = ({ formData, handleInputChange }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>House Details</Text>
        
        {/* Facing Direction */}
        <Text style={categoryContentStyles.label}>Facing Direction *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.facingDirection}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('facingDirection', value)}
          >
            <Picker.Item label="Select Direction" value="" />
            <Picker.Item label="North" value="North" />
            <Picker.Item label="South" value="South" />
            <Picker.Item label="East" value="East" />
            <Picker.Item label="West" value="West" />
          </Picker>
        </View>
        
        {/* Hall Dimensions */}
        <Text style={categoryContentStyles.label}>Hall Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={categoryContentStyles.subLabel}>Length</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Length"
              value={formData.hallLength}
              onChangeText={(value) => handleInputChange('hallLength', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={categoryContentStyles.subLabel}>Breadth</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Breadth"
              value={formData.hallBreadth}
              onChangeText={(value) => handleInputChange('hallBreadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Number of Bedrooms */}
        <Text style={categoryContentStyles.label}>Number of Bedrooms *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.noOfBedrooms}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('noOfBedrooms', value)}
          >
            <Picker.Item label="Select Number" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
          </Picker>
        </View>
        
        {/* Bedroom 1 Dimensions */}
        <Text style={categoryContentStyles.label}>Bedroom 1 Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={categoryContentStyles.subLabel}>Length</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Length"
              value={formData.bedroom1Length}
              onChangeText={(value) => handleInputChange('bedroom1Length', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={categoryContentStyles.subLabel}>Breadth</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Breadth"
              value={formData.bedroom1Breadth}
              onChangeText={(value) => handleInputChange('bedroom1Breadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Bedroom 2 Dimensions (conditional) */}
        {parseInt(formData.noOfBedrooms) >= 2 && (
          <>
            <Text style={categoryContentStyles.label}>Bedroom 2 Dimensions (feet)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={categoryContentStyles.subLabel}>Length</Text>
                <TextInput
                  style={categoryContentStyles.input}
                  placeholder="Length"
                  value={formData.bedroom2Length}
                  onChangeText={(value) => handleInputChange('bedroom2Length', value)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={categoryContentStyles.subLabel}>Breadth</Text>
                <TextInput
                  style={categoryContentStyles.input}
                  placeholder="Breadth"
                  value={formData.bedroom2Breadth}
                  onChangeText={(value) => handleInputChange('bedroom2Breadth', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}
        
        {/* Bedroom 3 Dimensions (conditional) */}
        {parseInt(formData.noOfBedrooms) >= 3 && (
          <>
            <Text style={categoryContentStyles.label}>Bedroom 3 Dimensions (feet)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={categoryContentStyles.subLabel}>Length</Text>
                <TextInput
                  style={categoryContentStyles.input}
                  placeholder="Length"
                  value={formData.bedroom3Length}
                  onChangeText={(value) => handleInputChange('bedroom3Length', value)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={categoryContentStyles.subLabel}>Breadth</Text>
                <TextInput
                  style={categoryContentStyles.input}
                  placeholder="Breadth"
                  value={formData.bedroom3Breadth}
                  onChangeText={(value) => handleInputChange('bedroom3Breadth', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}
        
        {/* Kitchen Dimensions */}
        <Text style={categoryContentStyles.label}>Kitchen Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={categoryContentStyles.subLabel}>Length</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Length"
              value={formData.kitchenLength}
              onChangeText={(value) => handleInputChange('kitchenLength', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={categoryContentStyles.subLabel}>Breadth</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Breadth"
              value={formData.kitchenBreadth}
              onChangeText={(value) => handleInputChange('kitchenBreadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Number of Bathrooms */}
        <Text style={categoryContentStyles.label}>Number of Bathrooms *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.noOfBathrooms}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('noOfBathrooms', value)}
          >
            <Picker.Item label="Select Number" value="" />
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
          </Picker>
        </View>
        
        {/* Bathroom 1 Type */}
        <Text style={categoryContentStyles.label}>Bathroom 1 Type *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.bathroom1Type}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('bathroom1Type', value)}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Indian" value="Indian" />
            <Picker.Item label="Western" value="Western" />
          </Picker>
        </View>
        
        {/* Bathroom 2 Type (conditional) */}
        {parseInt(formData.noOfBathrooms) >= 2 && (
          <>
            <Text style={categoryContentStyles.label}>Bathroom 2 Type</Text>
            <View style={categoryContentStyles.pickerContainer}>
              <Picker
                selectedValue={formData.bathroom2Type}
                style={categoryContentStyles.picker}
                onValueChange={(value) => handleInputChange('bathroom2Type', value)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Indian" value="Indian" />
                <Picker.Item label="Western" value="Western" />
              </Picker>
            </View>
          </>
        )}
        
        {/* Bathroom 3 Type (conditional) */}
        {parseInt(formData.noOfBathrooms) >= 3 && (
          <>
            <Text style={categoryContentStyles.label}>Bathroom 3 Type</Text>
            <View style={categoryContentStyles.pickerContainer}>
              <Picker
                selectedValue={formData.bathroom3Type}
                style={categoryContentStyles.picker}
                onValueChange={(value) => handleInputChange('bathroom3Type', value)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Indian" value="Indian" />
                <Picker.Item label="Western" value="Western" />
              </Picker>
            </View>
          </>
        )}
        
        {/* Floor Number */}
        <Text style={categoryContentStyles.label}>Floor Number *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.floorNo}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('floorNo', value)}
          >
            <Picker.Item label="Select Floor" value="" />
            <Picker.Item label="Ground Floor" value="Ground Floor" />
            <Picker.Item label="1st Floor" value="1st Floor" />
            <Picker.Item label="2nd Floor" value="2nd Floor" />
            <Picker.Item label="3rd Floor" value="3rd Floor" />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

export default Step2Details;