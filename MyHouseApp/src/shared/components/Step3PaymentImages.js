import React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import categoryContentStyles from "../../styles/categoryContentStyles";

const Step3PaymentImages = ({ formData, handleInputChange, handleImageSelect, handleRemoveImage, colors, dark }) => {

  // Ask permission
  const requestPermission = async (type) => {
    let result =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!result.granted) {
      Alert.alert(
        "Permission Denied",
        `Please enable ${type} access in settings.`
      );
      return false;
    }
    return true;
  };

  // Open camera or gallery
  const pickImage = async (source) => {
    const allowed = await requestPermission(source);
    if (!allowed) return;

    let result;

    try {
      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsMultipleSelection: true,
        });
      }

      const isCanceled = result?.canceled ?? result?.cancelled ?? true;
      if (!isCanceled) {
        const assets = Array.isArray(result.assets) ? result.assets : (result.uri ? [{ uri: result.uri }] : []);
        assets.forEach((img) => {
          const uri = img?.uri ?? img;
          if (uri) handleImageSelect(uri);
        });
      }
    } catch (err) {
      console.error('Image picker error:', err);
      Alert.alert('Error', 'Failed to pick image: ' + (err.message || 'Unknown'));
    }
  };

  const images = formData.images || [];

  // Helper functions to check if amounts are filled
  const hasLeaseAmount = formData.leaseAmount && !isNaN(parseFloat(formData.leaseAmount)) && parseFloat(formData.leaseAmount) > 0;
  const hasAdvanceAmount = formData.advanceAmount && !isNaN(parseFloat(formData.advanceAmount)) && parseFloat(formData.advanceAmount) > 0;
  const hasRentAmount = formData.rentAmount && !isNaN(parseFloat(formData.rentAmount)) && parseFloat(formData.rentAmount) > 0;

  // Determine which fields should be disabled
  const bothAdvanceAndRentFilled = hasAdvanceAmount && hasRentAmount;
  const advanceAndRentDisabled = hasLeaseAmount;
  const leaseDisabled = bothAdvanceAndRentFilled;

  return (
    <ScrollView style={{ width: "100%" }}>
      <View style={[categoryContentStyles.formContainer, { borderColor: colors?.primary || '#4A90E2' }]}>
        <Text style={[categoryContentStyles.formTitle, { color: colors?.primary || '#4A90E2' }]}>Payment Details</Text>

        {/* Payment Options Info */}
        <View style={{ backgroundColor: dark ? '#1A3A5A' : '#E8F4F8', padding: 12, borderRadius: 8, marginBottom: 15 }}>
          <Text style={{ fontSize: 12, color: dark ? '#4A90E2' : '#0066CC', marginBottom: 5 }}>Choose Payment Option:</Text>
          <Text style={{ fontSize: 12, color: colors?.text || '#333', lineHeight: 18 }}>
            <Text style={{ fontWeight: 'bold' }}>Option 1:</Text> Fill Lease Amount (you won't be able to fill Advance & Rent)
          </Text>
          <Text style={{ fontSize: 12, color: colors?.text || '#333', lineHeight: 18, marginTop: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Option 2:</Text> Fill Advance Amount & Monthly Rent (you won't be able to fill Lease Amount)
          </Text>
        </View>

        {/* Advance Amount */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }, advanceAndRentDisabled && { color: colors?.subText || '#CCCCCC' }]}>
          Advance Amount (₹) {advanceAndRentDisabled ? '(Disabled - Lease Amount selected)' : '*'}
        </Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }, advanceAndRentDisabled && { backgroundColor: dark ? '#333' : '#F5F5F5', color: colors?.subText || '#CCCCCC' }]}
          placeholder="Advance Amount"
          placeholderTextColor={advanceAndRentDisabled ? (dark ? '#555' : '#E0E0E0') : (colors?.placeholder || '#999999')}
          value={formData.advanceAmount}
          onChangeText={(value) => {
            if (!advanceAndRentDisabled) {
              handleInputChange('advanceAmount', value);
            }
          }}
          keyboardType="numeric"
          editable={!advanceAndRentDisabled}
        />

        {/* Monthly Rent */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }, advanceAndRentDisabled && { color: colors?.subText || '#CCCCCC' }]}>
          Monthly Rent (₹) {advanceAndRentDisabled ? '(Disabled - Lease Amount selected)' : '*'}
        </Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }, advanceAndRentDisabled && { backgroundColor: dark ? '#333' : '#F5F5F5', color: colors?.subText || '#CCCCCC' }]}
          placeholder="Monthly Rent"
          placeholderTextColor={advanceAndRentDisabled ? (dark ? '#555' : '#E0E0E0') : (colors?.placeholder || '#999999')}
          value={formData.rentAmount}
          onChangeText={(value) => {
            if (!advanceAndRentDisabled) {
              handleInputChange('rentAmount', value);
            }
          }}
          keyboardType="numeric"
          editable={!advanceAndRentDisabled}
        />

        {/* Lease Amount */}
        <Text style={[categoryContentStyles.label, { color: colors?.text || '#000' }, leaseDisabled && { color: colors?.subText || '#CCCCCC' }]}>
          Lease Amount (₹) {leaseDisabled && '(Disabled - Advance & Rent selected)'}
        </Text>
        <TextInput
          style={[categoryContentStyles.input, { backgroundColor: colors?.card || '#fff', color: colors?.text || '#000', borderColor: colors?.border || '#4A90E2' }, leaseDisabled && { backgroundColor: dark ? '#333' : '#F5F5F5', color: colors?.subText || '#CCCCCC' }]}
          placeholder="Lease Amount"
          placeholderTextColor={leaseDisabled ? (dark ? '#555' : '#E0E0E0') : (colors?.placeholder || '#999999')}
          value={formData.leaseAmount}
          onChangeText={(value) => {
            if (!leaseDisabled) {
              handleInputChange('leaseAmount', value);
            }
          }}
          keyboardType="numeric"
          editable={!leaseDisabled}
        />

        {/* Image Upload Section */}
        <Text style={[categoryContentStyles.label, { marginTop: 20, color: colors?.text || '#000' }]}>
          Upload House Images *
        </Text>
        <Text style={{ marginBottom: 15, color: colors?.text || '#333' }}>
          Upload minimum 4 and maximum 7 images of your property.
        </Text>

        {/* Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 20,
          }}
        >
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { backgroundColor: colors?.primary || '#4A90E2' }]}
            onPress={() => pickImage("camera")}
            disabled={images.length >= 7}
          >
            <Text style={categoryContentStyles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { backgroundColor: colors?.primary || '#4A90E2' }]}
            onPress={() => pickImage("gallery")}
            disabled={images.length >= 7}
          >
            <Text style={categoryContentStyles.buttonText}>Choose Images</Text>
          </TouchableOpacity>
        </View>

        {/* Show Images Grid */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          {images.map((uri, index) => (
            <View key={index} style={{ width: "30%", marginBottom: 15 }}>
              <Image
                source={{ uri }}
                style={{ width: "100%", height: 100, borderRadius: 5 }}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: colors?.secondary || "red",
                  padding: 5,
                  marginTop: 5,
                  borderRadius: 4,
                  alignItems: "center",
                }}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={{ color: "white", fontSize: 12 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Image Box */}
          {images.length < 7 && (
            <View style={{ width: "30%", marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  height: 100,
                  borderWidth: 1,
                  borderColor: colors?.border || "#aaa",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  backgroundColor: colors?.card || '#fff'
                }}
                onPress={() => pickImage("gallery")}
              >
                <Text style={{ fontSize: 26, color: colors?.primary || "#4A90E2" }}>+</Text>
                <Text style={{ fontSize: 12, color: colors?.subText || "#666" }}>Add Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={{ textAlign: "center", marginTop: 10, color: colors?.text || '#000' }}>
          {images.length} / 7 images uploaded
        </Text>
      </View>
    </ScrollView>
  );
};

export default Step3PaymentImages;
