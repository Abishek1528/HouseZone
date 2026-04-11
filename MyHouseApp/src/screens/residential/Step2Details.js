import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import categoryContentStyles from '../../styles/categoryContentStyles';

const Step2Details = ({ formData, handleInputChange, colors }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>House Details</Text>
        
        {/* Facing Direction */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Facing Direction *</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.facingDirection}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('facingDirection', value)}
          >
            <Picker.Item label="Select Direction" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="North" value="North" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="South" value="South" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="East" value="East" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="West" value="West" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Hall Dimensions */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Hall Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
            <TextInput
              style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
              placeholder="Length"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.hallLength}
              onChangeText={(value) => handleInputChange('hallLength', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
            <TextInput
              style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
              placeholder="Breadth"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.hallBreadth}
              onChangeText={(value) => handleInputChange('hallBreadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Number of Bedrooms */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Number of Bedrooms *</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.noOfBedrooms}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('noOfBedrooms', value)}
          >
            <Picker.Item label="Select Number" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="1" value="1" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="2" value="2" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="3" value="3" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Bedroom 1 Dimensions */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bedroom 1 Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
            <TextInput
              style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
              placeholder="Length"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.bedroom1Length}
              onChangeText={(value) => handleInputChange('bedroom1Length', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
            <TextInput
              style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
              placeholder="Breadth"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.bedroom1Breadth}
              onChangeText={(value) => handleInputChange('bedroom1Breadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Bedroom 2 Dimensions (conditional) */}
        {parseInt(formData.noOfBedrooms) >= 2 && (
          <>
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bedroom 2 Dimensions (feet)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
                <TextInput
                  style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                  placeholder="Length"
                  placeholderTextColor={colors?.placeholder || "#999999"}
                  value={formData.bedroom2Length}
                  onChangeText={(value) => handleInputChange('bedroom2Length', value)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
                <TextInput
                  style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                  placeholder="Breadth"
                  placeholderTextColor={colors?.placeholder || "#999999"}
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
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bedroom 3 Dimensions (feet)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
                <TextInput
                  style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                  placeholder="Length"
                  placeholderTextColor={colors?.placeholder || "#999999"}
                  value={formData.bedroom3Length}
                  onChangeText={(value) => handleInputChange('bedroom3Length', value)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
                <TextInput
                  style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
                  placeholder="Breadth"
                  placeholderTextColor={colors?.placeholder || "#999999"}
                  value={formData.bedroom3Breadth}
                  onChangeText={(value) => handleInputChange('bedroom3Breadth', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </>
        )}
        
        {/* Kitchen Dimensions */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Kitchen Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
            <TextInput
              style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
              placeholder="Length"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.kitchenLength}
              onChangeText={(value) => handleInputChange('kitchenLength', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
            <TextInput
              style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }]}
              placeholder="Breadth"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.kitchenBreadth}
              onChangeText={(value) => handleInputChange('kitchenBreadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        {/* Number of Bathrooms */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Number of Bathrooms *</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.noOfBathrooms}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('noOfBathrooms', value)}
          >
            <Picker.Item label="Select Number" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="1" value="1" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="2" value="2" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="3" value="3" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Bathroom 1 Access */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bathroom 1 Access *</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.bathroom1Access}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('bathroom1Access', value)}
          >
            <Picker.Item label="Select Access" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="Common" value="Common" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="Attached" value="Attached" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Bathroom 1 Type */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bathroom 1 Type *</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.bathroom1Type}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('bathroom1Type', value)}
          >
            <Picker.Item label="Select Type" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="Indian" value="Indian" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="Western" value="Western" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Bathroom 2 Access and Type (conditional) */}
        {parseInt(formData.noOfBathrooms) >= 2 && (
          <>
            {/* Bathroom 2 Access */}
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bathroom 2 Access</Text>
            <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
              <Picker
                selectedValue={formData.bathroom2Access}
                style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                dropdownIconColor={colors?.text || '#000'}
                onValueChange={(value) => handleInputChange('bathroom2Access', value)}
              >
                <Picker.Item label="Select Access" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
                <Picker.Item label="Common" value="Common" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
                <Picker.Item label="Attached" value="Attached" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
              </Picker>
            </View>
            
            {/* Bathroom 2 Type */}
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bathroom 2 Type</Text>
            <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
              <Picker
                selectedValue={formData.bathroom2Type}
                style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                dropdownIconColor={colors?.text || '#000'}
                onValueChange={(value) => handleInputChange('bathroom2Type', value)}
              >
                <Picker.Item label="Select Type" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
                <Picker.Item label="Indian" value="Indian" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
                <Picker.Item label="Western" value="Western" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
              </Picker>
            </View>
          </>
        )}
        
        {/* Bathroom 3 Access and Type (conditional) */}
        {parseInt(formData.noOfBathrooms) >= 3 && (
          <>
            {/* Bathroom 3 Access */}
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bathroom 3 Access</Text>
            <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
              <Picker
                selectedValue={formData.bathroom3Access}
                style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                dropdownIconColor={colors?.text || '#000'}
                onValueChange={(value) => handleInputChange('bathroom3Access', value)}
              >
                <Picker.Item label="Select Access" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
                <Picker.Item label="Common" value="Common" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
                <Picker.Item label="Attached" value="Attached" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
              </Picker>
            </View>
            
            {/* Bathroom 3 Type */}
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bathroom 3 Type</Text>
            <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
              <Picker
                selectedValue={formData.bathroom3Type}
                style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
                dropdownIconColor={colors?.text || '#000'}
                onValueChange={(value) => handleInputChange('bathroom3Type', value)}
              >
                <Picker.Item label="Select Type" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
                <Picker.Item label="Indian" value="Indian" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
                <Picker.Item label="Western" value="Western" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
              </Picker>
            </View>
          </>
        )}
        
        {/* Floor Number */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Floor Number *</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.floorNo}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('floorNo', value)}
          >
            <Picker.Item label="Select Floor" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="Ground Floor" value="Ground Floor" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="1st Floor" value="1st Floor" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="2nd Floor" value="2nd Floor" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="3rd Floor" value="3rd Floor" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Parking (2-Wheeler) */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Parking (2-Wheeler)</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.parking2Wheeler}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('parking2Wheeler', value)}
          >
            <Picker.Item label="Select Number" value="" color={colors?.placeholder || "#999999"} style={{ fontSize: 15 }} />
            <Picker.Item label="1" value="1" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="2" value="2" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="3" value="3" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
        
        {/* Parking (4-Wheeler) */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Parking (4-Wheeler)</Text>
        <View style={[categoryContentStyles.pickerContainer, { backgroundColor: colors?.card || '#fff', borderColor: colors?.border || '#4A90E2' }]}>
          <Picker
            selectedValue={formData.parking4Wheeler}
            style={[categoryContentStyles.picker, { color: colors?.text || '#000' }]}
            dropdownIconColor={colors?.text || '#000'}
            onValueChange={(value) => handleInputChange('parking4Wheeler', value)}
          >
            <Picker.Item label="No" value="No" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
            <Picker.Item label="Yes" value="Yes" color={colors?.text || "#000000"} style={{ fontSize: 15 }} />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

export default Step2Details;