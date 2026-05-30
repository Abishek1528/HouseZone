import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, Modal, TextInput, ScrollView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import OptionSelectField from "../../shared/components/OptionSelectField";
import { useTheme } from "../../context/ThemeContext";
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import { getAllResidentialOwners } from "./api";

const BUS_STOP_OPTIONS = [
  { label: "Vandigate", value: "Vandigate" },
  { label: "Main Busstand", value: "Main Busstand" },
  { label: "Kanjithotimunai", value: "Kanjithotimunai" },
  { label: "Depo", value: "Depo" },
  { label: "South Car Street", value: "South Car Street" },
];

const SCHOOL_OPTIONS = [
  { label: "Kamraj Matric", value: "Kamraj Matric" },
  { label: "Kamraj CBSE", value: "Kamraj CBSE" },
  { label: "Raghavendra CBSE", value: "Raghavendra CBSE" },
  { label: "Edison", value: "Edison" },
  { label: "Oxford", value: "Oxford" },
  { label: "Kamraj Main", value: "Kamraj Main" },
  { label: "Venus Matric", value: "Venus Matric" },
];

const SHOPPING_MALL_OPTIONS = [
  { label: "National", value: "National" },
  { label: "Noothanam", value: "Noothanam" },
  { label: "Metro Hyper Mall", value: "Metro Hyper Mall" },
  { label: "VK Mart", value: "VK Mart" },
  { label: "Asian", value: "Asian" },
];

const BANK_OPTIONS = [
  { label: "Indian", value: "Indian" },
  { label: "HDFC", value: "HDFC" },
  { label: "Canara", value: "Canara" },
  { label: "Central", value: "Central" },
  { label: "SBI", value: "SBI" },
];

export default function ResidentialOwnerPage() {
  const navigation = useNavigation();
  const { colors } = useTheme();
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
    
    // Add a focus listener to reload data when returning to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      loadOwners();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllResidentialOwners();
      console.log('Loaded residential owners data:', data);
      if (Array.isArray(data)) {
        setOwners(data);
      } else {
        console.warn('API returned non-array data:', data);
        setOwners([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load residential owners. Please try again.');
      console.error('Error loading owners:', error);
      setOwners([]);
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
    setUpdateFormData({
      streetSizeBreadth: item.streetSize ? item.streetSize.toString() : '',
      nearbyBusStop: item.nearbyBusStop || '',
      busStopDistance: item.nearbyBusStopDistance ? item.nearbyBusStopDistance.toString() : '',
      nearbySchool: item.nearbySchool || '',
      schoolDistance: item.nearbySchoolDistance ? item.nearbySchoolDistance.toString() : '',
      nearbyShoppingMall: item.nearbyShoppingMall || '',
      shoppingMallDistance: item.nearbyShoppingMallDistance ? item.nearbyShoppingMallDistance.toString() : '',
      nearbyBank: item.nearbyBank || '',
      bankDistance: item.nearbyBankDistance ? item.nearbyBankDistance.toString() : ''
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

  const handleSubmitUpdate = async () => {
    // Helper to validate numeric strings
    const isValidNumber = (val) => {
      if (!val || val.toString().trim() === '') return false;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    };

    // Validate form
    if (!isValidNumber(updateFormData.streetSizeBreadth)) {
      Alert.alert('Validation Error', 'Please enter a valid street size width (positive number)');
      return;
    }
    
    // Validate bus stop distance if a bus stop is selected
    if (updateFormData.nearbyBusStop && !isValidNumber(updateFormData.busStopDistance)) {
      Alert.alert('Validation Error', 'Please enter a valid distance for the selected bus stop');
      return;
    }
    
    // Validate school distance if a school is selected
    if (updateFormData.nearbySchool && !isValidNumber(updateFormData.schoolDistance)) {
      Alert.alert('Validation Error', 'Please enter a valid distance for the selected school');
      return;
    }
    
    // Validate shopping mall distance if a shopping mall is selected
    if (updateFormData.nearbyShoppingMall && !isValidNumber(updateFormData.shoppingMallDistance)) {
      Alert.alert('Validation Error', 'Please enter a valid distance for the selected shopping mall');
      return;
    }
    
    // Validate bank distance if a bank is selected
    if (updateFormData.nearbyBank && !isValidNumber(updateFormData.bankDistance)) {
      Alert.alert('Validation Error', 'Please enter a valid distance for the selected bank');
      return;
    }

    // Navigate to the conditions page with the form data
    handleCloseModal();
    
    // Navigate to the conditions page with the owner data and form data
    navigation.navigate('ConditionsPage', { 
      ownerData: selectedOwner, 
      formData: updateFormData,
      refreshOwners: loadOwners  // Pass the refresh function
    });
  }
  
  // Helper function to render conditions based on selected condition numbers
  const renderConditions = (conditionNumbers) => {
    if (!conditionNumbers) {
      return (
        <Text style={residentialOwnerStyles.detailValue}>No conditions specified</Text>
      );
    }
    
    let parsedConditionNumbers = [];
    
    try {
      if (Array.isArray(conditionNumbers)) {
        parsedConditionNumbers = conditionNumbers;
      } else if (typeof conditionNumbers === 'string') {
        // Try to parse as JSON first
        if (conditionNumbers.startsWith('[') || conditionNumbers.startsWith('{')) {
          const parsed = JSON.parse(conditionNumbers);
          parsedConditionNumbers = Array.isArray(parsed) ? parsed : [parsed];
        } else if (conditionNumbers.includes(',')) {
          // If it's a comma-separated string
          parsedConditionNumbers = conditionNumbers.split(',').map(n => n.trim()).filter(n => n !== '');
        } else if (conditionNumbers.trim() !== '') {
          // Single value string
          parsedConditionNumbers = [conditionNumbers.trim()];
        }
      } else if (typeof conditionNumbers === 'number') {
        parsedConditionNumbers = [conditionNumbers];
      }
    } catch (error) {
      console.error('Error parsing condition numbers:', error, 'Value:', conditionNumbers);
      return (
        <Text style={residentialOwnerStyles.detailValue}>Error loading conditions</Text>
      );
    }
    
    // Array of predefined conditions corresponding to numbers 1-6
    const predefinedConditions = [
      'No structural changes without owner’s permission.',
      'Water and electricity bills must be paid by the tenant.',
      'Advance/deposit amount is non-refundable.',
      'No damage to property, repair costs will be deducted from the deposit.',
      'Pets are not allowed on the premises.',
      'Only Vegetarian.'
    ];
    
    // Filter and map to condition text
    const validConditions = parsedConditionNumbers
      .map(num => parseInt(num))
      .filter(num => !isNaN(num) && num >= 1 && num <= predefinedConditions.length)
      .map(num => predefinedConditions[num - 1]);
    
    if (validConditions.length === 0) {
      return (
        <Text style={residentialOwnerStyles.detailValue}>No conditions specified</Text>
      );
    }
    
    // Render each selected condition
    return validConditions.map((conditionText, index) => (
      <Text key={index} style={residentialOwnerStyles.conditionText}>{conditionText}</Text>
    ));
  };

  const renderOwner = ({ item }) => {
    const isExpanded = expandedOwners[item.id];
    
    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName}</Text>
            <Text style={residentialOwnerStyles.summaryText}>{item.numberOfBedrooms ? `${item.numberOfBedrooms} BHK` : 'N/A BHK'}</Text>
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
              {/* Images Gallery */}
              {Array.isArray(item.images) && item.images.filter(img => typeof img === 'string' && img.trim() !== '').length > 0 && (
                <View style={residentialOwnerStyles.detailSection}>
                  <Text style={residentialOwnerStyles.sectionTitle}>Images</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                    {item.images
                      .filter(img => typeof img === 'string' && img.trim() !== '')
                      .map((img, idx) => (
                        <Image 
                          key={idx} 
                          source={{ uri: img }} 
                          style={{ width: 300, height: 200, borderRadius: 10, marginRight: 10 }} 
                          resizeMode="cover" 
                        />
                      ))
                    }
                  </ScrollView>
                </View>
              )}
              <View style={residentialOwnerStyles.detailSection}>
                <Text style={residentialOwnerStyles.sectionTitle}>Owner Information</Text>
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
              {item.numberOfBathrooms && !isNaN(parseInt(item.numberOfBathrooms)) && parseInt(item.numberOfBathrooms) >= 1 && (
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 1:</Text> <Text style={residentialOwnerStyles.detailValue}>
                  {(item.bathroom1Access && item.bathroom1Type) ? `${item.bathroom1Access} - ${item.bathroom1Type}` : 
                   (item.bathroom1Access ? item.bathroom1Access : 
                   (item.bathroom1Type || 'N/A'))}
                </Text>
              </Text>
              )}
              {item.numberOfBathrooms && !isNaN(parseInt(item.numberOfBathrooms)) && parseInt(item.numberOfBathrooms) >= 2 && (
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 2:</Text> <Text style={residentialOwnerStyles.detailValue}>
                  {(item.bathroom2Access && item.bathroom2Type) ? `${item.bathroom2Access} - ${item.bathroom2Type}` : 
                   (item.bathroom2Access ? item.bathroom2Access : 
                   (item.bathroom2Type || 'N/A'))}
                </Text>
              </Text>
              )}
              {item.numberOfBathrooms && !isNaN(parseInt(item.numberOfBathrooms)) && parseInt(item.numberOfBathrooms) >= 3 && (
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 3:</Text> <Text style={residentialOwnerStyles.detailValue}>
                  {(item.bathroom3Access && item.bathroom3Type) ? `${item.bathroom3Access} - ${item.bathroom3Type}` : 
                   (item.bathroom3Access ? item.bathroom3Access : 
                   (item.bathroom3Type || 'N/A'))}
                </Text>
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
                <Text style={residentialOwnerStyles.detailLabel}>Street Size:</Text> <Text style={residentialOwnerStyles.detailValue}>{item?.streetSize ? `${item.streetSize} ft` : 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bus Stop:</Text> <Text style={residentialOwnerStyles.detailValue}>{item?.nearbyBusStop ? `${item.nearbyBusStop}${item?.nearbyBusStopDistance ? ` - ${item.nearbyBusStopDistance} km` : ''}` : 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>School:</Text> <Text style={residentialOwnerStyles.detailValue}>{item?.nearbySchool ? `${item.nearbySchool}${item?.nearbySchoolDistance ? ` - ${item.nearbySchoolDistance} km` : ''}` : 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Shopping Mall:</Text> <Text style={residentialOwnerStyles.detailValue}>{item?.nearbyShoppingMall ? `${item.nearbyShoppingMall}${item?.nearbyShoppingMallDistance ? ` - ${item.nearbyShoppingMallDistance} km` : ''}` : 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bank:</Text> <Text style={residentialOwnerStyles.detailValue}>{item?.nearbyBank ? `${item.nearbyBank}${item?.nearbyBankDistance ? ` - ${item.nearbyBankDistance} km` : ''}` : 'N/A'}</Text>
              </Text>
            </View>
            
            {/* Conditions Section */}
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Property Conditions</Text>
              {renderConditions(item?.conditionNumbers)}
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
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
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
                <OptionSelectField
                  label="Bus Stop"
                  options={BUS_STOP_OPTIONS}
                  selectedValue={updateFormData.nearbyBusStop}
                  onSelect={(value) => handleInputChange('nearbyBusStop', value)}
                  colors={colors}
                />
                
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
                <OptionSelectField
                  label="School"
                  options={SCHOOL_OPTIONS}
                  selectedValue={updateFormData.nearbySchool}
                  onSelect={(value) => handleInputChange('nearbySchool', value)}
                  colors={colors}
                />
                
                
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
                <OptionSelectField
                  label="Shopping Mall"
                  options={SHOPPING_MALL_OPTIONS}
                  selectedValue={updateFormData.nearbyShoppingMall}
                  onSelect={(value) => handleInputChange('nearbyShoppingMall', value)}
                  colors={colors}
                />
                
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
                <OptionSelectField
                  label="Bank"
                  options={BANK_OPTIONS}
                  selectedValue={updateFormData.nearbyBank}
                  onSelect={(value) => handleInputChange('nearbyBank', value)}
                  colors={colors}
                />
                
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