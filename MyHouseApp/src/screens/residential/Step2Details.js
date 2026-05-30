import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import categoryContentStyles from '../../styles/categoryContentStyles';
import OptionSelectField from '../../shared/components/OptionSelectField';

const DIRECTION_OPTIONS = [
  { label: "North", value: "North" },
  { label: "South", value: "South" },
  { label: "East", value: "East" },
  { label: "West", value: "West" },
];

const COUNT_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
];

const BATHROOM_ACCESS_OPTIONS = [
  { label: "Common", value: "Common" },
  { label: "Attached", value: "Attached" },
];

const BATHROOM_TYPE_OPTIONS = [
  { label: "Indian", value: "Indian" },
  { label: "Western", value: "Western" },
];

const FLOOR_OPTIONS = [
  { label: "Ground Floor", value: "Ground Floor" },
  { label: "1st Floor", value: "1st Floor" },
  { label: "2nd Floor", value: "2nd Floor" },
  { label: "3rd Floor", value: "3rd Floor" },
];

const PARKING_4W_OPTIONS = [
  { label: "No", value: "No" },
  { label: "Yes", value: "Yes" },
];

const Step2Details = ({ formData, handleInputChange, colors }) => {
  const inputStyle = [
    categoryContentStyles.input,
    { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' },
  ];

  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>House Details</Text>

        <OptionSelectField
          label="Facing Direction *"
          options={DIRECTION_OPTIONS}
          selectedValue={formData.facingDirection}
          onSelect={(value) => handleInputChange('facingDirection', value)}
          colors={colors}
        />

        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Hall Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
            <TextInput
              style={inputStyle}
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
              style={inputStyle}
              placeholder="Breadth"
              placeholderTextColor={colors?.placeholder || "#999999"}
              value={formData.hallBreadth}
              onChangeText={(value) => handleInputChange('hallBreadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <OptionSelectField
          label="Number of Bedrooms *"
          options={COUNT_OPTIONS}
          selectedValue={formData.noOfBedrooms}
          onSelect={(value) => handleInputChange('noOfBedrooms', value)}
          colors={colors}
        />

        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bedroom 1 Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
            <TextInput style={inputStyle} placeholder="Length" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.bedroom1Length} onChangeText={(value) => handleInputChange('bedroom1Length', value)} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
            <TextInput style={inputStyle} placeholder="Breadth" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.bedroom1Breadth} onChangeText={(value) => handleInputChange('bedroom1Breadth', value)} keyboardType="numeric" />
          </View>
        </View>

        {parseInt(formData.noOfBedrooms) >= 2 && (
          <>
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bedroom 2 Dimensions (feet)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
                <TextInput style={inputStyle} placeholder="Length" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.bedroom2Length} onChangeText={(value) => handleInputChange('bedroom2Length', value)} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
                <TextInput style={inputStyle} placeholder="Breadth" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.bedroom2Breadth} onChangeText={(value) => handleInputChange('bedroom2Breadth', value)} keyboardType="numeric" />
              </View>
            </View>
          </>
        )}

        {parseInt(formData.noOfBedrooms) >= 3 && (
          <>
            <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Bedroom 3 Dimensions (feet)</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
                <TextInput style={inputStyle} placeholder="Length" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.bedroom3Length} onChangeText={(value) => handleInputChange('bedroom3Length', value)} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
                <TextInput style={inputStyle} placeholder="Breadth" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.bedroom3Breadth} onChangeText={(value) => handleInputChange('bedroom3Breadth', value)} keyboardType="numeric" />
              </View>
            </View>
          </>
        )}

        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }]}>Kitchen Dimensions (feet) *</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Length</Text>
            <TextInput style={inputStyle} placeholder="Length" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.kitchenLength} onChangeText={(value) => handleInputChange('kitchenLength', value)} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[categoryContentStyles.subLabel, { color: colors?.subText || '#666' }]}>Breadth</Text>
            <TextInput style={inputStyle} placeholder="Breadth" placeholderTextColor={colors?.placeholder || "#999999"} value={formData.kitchenBreadth} onChangeText={(value) => handleInputChange('kitchenBreadth', value)} keyboardType="numeric" />
          </View>
        </View>

        <OptionSelectField
          label="Number of Bathrooms *"
          options={COUNT_OPTIONS}
          selectedValue={formData.noOfBathrooms}
          onSelect={(value) => handleInputChange('noOfBathrooms', value)}
          colors={colors}
        />

        <OptionSelectField
          label="Bathroom 1 Access *"
          options={BATHROOM_ACCESS_OPTIONS}
          selectedValue={formData.bathroom1Access}
          onSelect={(value) => handleInputChange('bathroom1Access', value)}
          colors={colors}
        />

        <OptionSelectField
          label="Bathroom 1 Type *"
          options={BATHROOM_TYPE_OPTIONS}
          selectedValue={formData.bathroom1Type}
          onSelect={(value) => handleInputChange('bathroom1Type', value)}
          colors={colors}
        />

        {parseInt(formData.noOfBathrooms) >= 2 && (
          <>
            <OptionSelectField
              label="Bathroom 2 Access"
              options={BATHROOM_ACCESS_OPTIONS}
              selectedValue={formData.bathroom2Access}
              onSelect={(value) => handleInputChange('bathroom2Access', value)}
              colors={colors}
            />
            <OptionSelectField
              label="Bathroom 2 Type"
              options={BATHROOM_TYPE_OPTIONS}
              selectedValue={formData.bathroom2Type}
              onSelect={(value) => handleInputChange('bathroom2Type', value)}
              colors={colors}
            />
          </>
        )}

        {parseInt(formData.noOfBathrooms) >= 3 && (
          <>
            <OptionSelectField
              label="Bathroom 3 Access"
              options={BATHROOM_ACCESS_OPTIONS}
              selectedValue={formData.bathroom3Access}
              onSelect={(value) => handleInputChange('bathroom3Access', value)}
              colors={colors}
            />
            <OptionSelectField
              label="Bathroom 3 Type"
              options={BATHROOM_TYPE_OPTIONS}
              selectedValue={formData.bathroom3Type}
              onSelect={(value) => handleInputChange('bathroom3Type', value)}
              colors={colors}
            />
          </>
        )}

        <OptionSelectField
          label="Floor Number *"
          options={FLOOR_OPTIONS}
          selectedValue={formData.floorNo}
          onSelect={(value) => handleInputChange('floorNo', value)}
          colors={colors}
        />

        <OptionSelectField
          label="Parking (2-Wheeler)"
          options={COUNT_OPTIONS}
          selectedValue={formData.parking2Wheeler}
          onSelect={(value) => handleInputChange('parking2Wheeler', value)}
          colors={colors}
        />

        <OptionSelectField
          label="Parking (4-Wheeler)"
          options={PARKING_4W_OPTIONS}
          selectedValue={formData.parking4Wheeler}
          onSelect={(value) => handleInputChange('parking4Wheeler', value)}
          colors={colors}
        />
      </View>
    </ScrollView>
  );
};

export default Step2Details;
