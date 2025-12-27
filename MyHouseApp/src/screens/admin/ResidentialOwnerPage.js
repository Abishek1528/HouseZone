import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import { getAllResidentialOwners } from "./api";

export default function ResidentialOwnerPage() {
  const navigation = useNavigation();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOwners, setExpandedOwners] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    streetSizeBreadth: '',
    nearbyBusStop: '',
    busStopDistance: '',
    nearbySchool: '',
    schoolDistance: '',
    nearbyShoppingMall: '',
    shoppingMallDistance: '',
    nearbyBank: '',
    bankDistance: ''
  });

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllResidentialOwners();
      setOwners(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load residential owners. Please try again.');
      console.error('Error loading owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOwnerDetails = (ownerId) => {
    setExpandedOwners(prev => ({
      ...prev,
      [ownerId]: !prev[ownerId]
    }));
  };

  const handleUpdateDetails = (item) => {
    setSelectedOwner(item);
    // Reset form data when opening modal
    setUpdateFormData({
      streetSizeBreadth: '',
      nearbyBusStop: '',
      busStopDistance: '',
      nearbySchool: '',
      schoolDistance: '',
      nearbyShoppingMall: '',
      shoppingMallDistance: '',
      nearbyBank: '',
      bankDistance: ''
    });
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedOwner(null);
    setUpdateFormData({
      streetSizeBreadth: '',
      nearbyBusStop: '',
      busStopDistance: '',
      nearbySchool: '',
      schoolDistance: '',
      nearbyShoppingMall: '',
      shoppingMallDistance: '',
      nearbyBank: '',
      bankDistance: ''
    });
  };

  const handleInputChange = (field, value) => {
    setUpdateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitUpdate = () => {
    // Validate form
    if (!updateFormData.streetSizeBreadth) {
      Alert.alert('Validation Error', 'Please enter street size width');
      return;
    }
    
    // Validate bus stop distance if a bus stop is selected
    if (updateFormData.nearbyBusStop && !updateFormData.busStopDistance) {
      Alert.alert('Validation Error', 'Please enter the distance for the selected bus stop');
      return;
    }
    
    // Validate school distance if a school is selected
    if (updateFormData.nearbySchool && !updateFormData.schoolDistance) {
      Alert.alert('Validation Error', 'Please enter the distance for the selected school');
      return;
    }
    
    // Validate shopping mall distance if a shopping mall is selected
    if (updateFormData.nearbyShoppingMall && !updateFormData.shoppingMallDistance) {
      Alert.alert('Validation Error', 'Please enter the distance for the selected shopping mall');
      return;
    }
    
    // Validate bank distance if a bank is selected
    if (updateFormData.nearbyBank && !updateFormData.bankDistance) {
      Alert.alert('Validation Error', 'Please enter the distance for the selected bank');
      return;
    }

    // Navigate to the conditions page with the form data
    handleCloseModal();
    
    // Navigate to the conditions page with the owner data and form data
    navigation.navigate('ConditionsPage', { 
      ownerData: selectedOwner, 
      formData: updateFormData 
    });
  };

  const renderOwner = ({ item }) => {
    const isExpanded = expandedOwners[item.id];
    
    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Bedrooms: {item.numberOfBedrooms || 'N/A'}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Rent: ₹{item.monthlyRent || 'N/A'}/month</Text>
          </View>
          <TouchableOpacity 
            style={residentialOwnerStyles.viewMoreButton}
            onPress={() => toggleOwnerDetails(item.id)}
          >
            <Text style={residentialOwnerStyles.viewMoreText}>
              {isExpanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Detailed view (shown when expanded) */}
        {isExpanded && (
          <View style={residentialOwnerStyles.detailedContainer}>
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Personal Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>ID:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.id}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Name:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.ownerName}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Contact:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.contactNo}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Address Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Door No:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.doorNo}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Street:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.street}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Area:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.area}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>City:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.city}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Pincode:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.pincode}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Property Details</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Facing Direction:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.facingDirection || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Hall Dimensions:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.hallLength || 'N/A'} x {item.hallBreadth || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Kitchen Dimensions:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.kitchenLength || 'N/A'} x {item.kitchenBreadth || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Number of Bathrooms:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.numberOfBathrooms || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 1 Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.bathroom1Type || 'N/A'}</Text>
              </Text>
              {item.bathroom2Type !== undefined && (
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 2 Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.bathroom2Type || 'N/A'}</Text>
              </Text>
              )}
              {item.bathroom3Type !== undefined && (
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 3 Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.bathroom3Type || 'N/A'}</Text>
              </Text>
              )}
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Floor Number:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.floorNumber || 'N/A'}</Text>
              </Text>
              {item.parking2Wheeler !== undefined && (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Parking (2-Wheeler):</Text> <Text style={residentialOwnerStyles.detailValue}>{item.parking2Wheeler || 'N/A'}</Text>
                </Text>
              )}
              {item.parking4Wheeler !== undefined && (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Parking (4-Wheeler):</Text> <Text style={residentialOwnerStyles.detailValue}>{item.parking4Wheeler || 'N/A'}</Text>
                </Text>
              )}
            </View>
            
            {/* Location & Nearby Amenities Section (similar to tenant page) */}
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Location & Nearby Amenities</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Street Size:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby Bus Stop:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby School:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby Shopping Mall:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby Bank:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Payment Information</Text>
              
              {/* Display lease amount if available, otherwise show advance and monthly rent */}
              {item.leaseAmount ? (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Lease Amount:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.leaseAmount}</Text>
                </Text>
              ) : (
                <>
                  <Text style={residentialOwnerStyles.detailText}>
                    <Text style={residentialOwnerStyles.detailLabel}>Advance Amount:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.advanceAmount || 'N/A'}</Text>
                  </Text>
                  <Text style={residentialOwnerStyles.detailText}>
                    <Text style={residentialOwnerStyles.detailLabel}>Monthly Rent:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.monthlyRent || 'N/A'}</Text>
                  </Text>
                </>
              )}
            </View>
            
            {/* Update Details Button */}
            <View style={residentialOwnerStyles.updateButtonContainer}>
              <TouchableOpacity 
                style={residentialOwnerStyles.updateButton}
                onPress={() => handleUpdateDetails(item)}
              >
                <Text style={residentialOwnerStyles.updateButtonText}>Update Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={residentialOwnerStyles.container}>
      <View style={residentialOwnerStyles.contentContainer}>
        <Text style={residentialOwnerStyles.title}>Residential Owners</Text>
        
        {loading ? (
          <View style={residentialOwnerStyles.loadingContainer}>
            <Text style={residentialOwnerStyles.loadingText}>Loading residential owners...</Text>
          </View>
        ) : owners.length === 0 ? (
          <View style={residentialOwnerStyles.noDataContainer}>
            <Text style={residentialOwnerStyles.noDataText}>No residential owners found</Text>
          </View>
        ) : (
          <FlatList
            data={owners}
            renderItem={renderOwner}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Update Details Modal */}
      <Modal
        visible={showUpdateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={residentialOwnerStyles.modalOverlay}>
          <View style={residentialOwnerStyles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={residentialOwnerStyles.modalTitle}>
                Update Location & Amenities
              </Text>
              {selectedOwner && (
                <Text style={residentialOwnerStyles.modalSubtitle}>
                  {selectedOwner.ownerName} - ID: {selectedOwner.id}
                </Text>
              )}

              {/* Street Size */}
              <View style={residentialOwnerStyles.formGroup}>
                <Text style={residentialOwnerStyles.formLabel}>Street Size Width (ft)</Text>
                <TextInput
                  style={residentialOwnerStyles.formInput}
                  placeholder="Enter width in feet"
                  keyboardType="numeric"
                  value={updateFormData.streetSizeBreadth}
                  onChangeText={(value) => handleInputChange('streetSizeBreadth', value)}
                />
              </View>

              {/* Nearby Bus Stop */}
              <View style={residentialOwnerStyles.formGroup}>
                <Text style={residentialOwnerStyles.formLabel}>Nearby Bus Stop</Text>
                <View style={residentialOwnerStyles.pickerContainer}>
                  <Picker
                    selectedValue={updateFormData.nearbyBusStop}
                    style={residentialOwnerStyles.picker}
                    onValueChange={(value) => handleInputChange('nearbyBusStop', value)}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Bus Stop" value="" color="#999999" style={{ fontSize: 15 }} />
                    <Picker.Item label="Vandigate" value="Vandigate" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Main Busstand" value="Main Busstand" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Kanjithotimunai" value="Kanjithotimunai" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Depo" value="Depo" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="South Car Street" value="South Car Street" color="#000000" style={{ fontSize: 15 }} />
                  </Picker>
                </View>
                
                {/* Distance input field - shown only when a bus stop is selected */}
                {updateFormData.nearbyBusStop !== '' && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={residentialOwnerStyles.formLabel}>Distance (km)</Text>
                    <TextInput
                      style={residentialOwnerStyles.formInput}
                      placeholder="Enter distance in km"
                      keyboardType="numeric"
                      value={updateFormData.busStopDistance}
                      onChangeText={(value) => handleInputChange('busStopDistance', value)}
                    />
                  </View>
                )}
              </View>

              {/* Nearby School */}
              <View style={residentialOwnerStyles.formGroup}>
                <Text style={residentialOwnerStyles.formLabel}>Nearby School</Text>
                <View style={residentialOwnerStyles.pickerContainer}>
                  <Picker
                    selectedValue={updateFormData.nearbySchool}
                    style={residentialOwnerStyles.picker}
                    onValueChange={(value) => handleInputChange('nearbySchool', value)}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select School" value="" color="#999999" style={{ fontSize: 15 }} />
                    <Picker.Item label="Kamraj Matric" value="Kamraj Matric" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Kamraj CBSE" value="Kamraj CBSE" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Raghavendra CBSE" value="Raghavendra CBSE" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Edison" value="Edison" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Oxford" value="Oxford" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Kamraj Main" value="Kamraj Main" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Venus Matric" value="Venus Matric" color="#000000" style={{ fontSize: 15 }} />
                  </Picker>
                </View>
                
                {/* Distance input field - shown only when a school is selected */}
                {updateFormData.nearbySchool !== '' && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={residentialOwnerStyles.formLabel}>Distance (km)</Text>
                    <TextInput
                      style={residentialOwnerStyles.formInput}
                      placeholder="Enter distance in km"
                      keyboardType="numeric"
                      value={updateFormData.schoolDistance}
                      onChangeText={(value) => handleInputChange('schoolDistance', value)}
                    />
                  </View>
                )}
              </View>

              {/* Nearby Shopping Mall */}
              <View style={residentialOwnerStyles.formGroup}>
                <Text style={residentialOwnerStyles.formLabel}>Nearby Shopping Mall</Text>
                <View style={residentialOwnerStyles.pickerContainer}>
                  <Picker
                    selectedValue={updateFormData.nearbyShoppingMall}
                    style={residentialOwnerStyles.picker}
                    onValueChange={(value) => handleInputChange('nearbyShoppingMall', value)}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Shopping Mall" value="" color="#999999" style={{ fontSize: 15 }} />
                    <Picker.Item label="National" value="National" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Noothanam" value="Noothanam" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Metro Hyper Mall" value="Metro Hyper Mall" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="VK Mart" value="VK Mart" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Asian" value="Asian" color="#000000" style={{ fontSize: 15 }} />
                  </Picker>
                </View>
                
                {/* Distance input field - shown only when a shopping mall is selected */}
                {updateFormData.nearbyShoppingMall !== '' && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={residentialOwnerStyles.formLabel}>Distance (km)</Text>
                    <TextInput
                      style={residentialOwnerStyles.formInput}
                      placeholder="Enter distance in km"
                      keyboardType="numeric"
                      value={updateFormData.shoppingMallDistance}
                      onChangeText={(value) => handleInputChange('shoppingMallDistance', value)}
                    />
                  </View>
                )}
              </View>

              {/* Nearby Bank */}
              <View style={residentialOwnerStyles.formGroup}>
                <Text style={residentialOwnerStyles.formLabel}>Nearby Bank</Text>
                <View style={residentialOwnerStyles.pickerContainer}>
                  <Picker
                    selectedValue={updateFormData.nearbyBank}
                    style={residentialOwnerStyles.picker}
                    onValueChange={(value) => handleInputChange('nearbyBank', value)}
                    mode="dropdown"
                  >
                    <Picker.Item label="Select Bank" value="" color="#999999" style={{ fontSize: 15 }} />
                    <Picker.Item label="Indian" value="Indian" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="HDFC" value="HDFC" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Canara" value="Canara" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="Central" value="Central" color="#000000" style={{ fontSize: 15 }} />
                    <Picker.Item label="SBI" value="SBI" color="#000000" style={{ fontSize: 15 }} />
                  </Picker>
                </View>
                
                {/* Distance input field - shown only when a bank is selected */}
                {updateFormData.nearbyBank !== '' && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={residentialOwnerStyles.formLabel}>Distance (km)</Text>
                    <TextInput
                      style={residentialOwnerStyles.formInput}
                      placeholder="Enter distance in km"
                      keyboardType="numeric"
                      value={updateFormData.bankDistance}
                      onChangeText={(value) => handleInputChange('bankDistance', value)}
                    />
                  </View>
                )}
              </View>

              {/* Buttons */}
              <View style={residentialOwnerStyles.modalButtonContainer}>
                <TouchableOpacity
                  style={residentialOwnerStyles.modalCancelButton}
                  onPress={handleCloseModal}
                >
                  <Text style={residentialOwnerStyles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={residentialOwnerStyles.modalSubmitButton}
                  onPress={handleSubmitUpdate}
                >
                  <Text style={residentialOwnerStyles.modalSubmitButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}