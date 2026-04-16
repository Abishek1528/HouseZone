import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ImageView from "react-native-image-viewing";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPropertyDetails } from './api';
import propertyDetailsStyles from './propertyDetailsStyles';
import { useTheme } from '../../../context/ThemeContext';

export default function PropertyDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dark, colors } = useTheme();
  const { propertyId } = route.params || {};
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  const API_HOST = API_BASE_URL.replace(/\/api$/, '');

  useEffect(() => {
    if (propertyId) {
      loadPropertyDetails();
    }
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      const data = await getPropertyDetails(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Error loading property details:', error);
      Alert.alert('Error', `Failed to load property details: ${error.message || 'Unknown error'}`);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
        <Header />
        <View style={categoryContentStyles.content}>
          <Text style={[propertyDetailsStyles.loadingText, { color: colors.subText }]}>Loading property details...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
        <Header />
        <View style={categoryContentStyles.content}>
          <Text style={[propertyDetailsStyles.errorText, { color: colors.subText }]}>Property not found</Text>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { backgroundColor: colors.primary }]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={categoryContentStyles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </View>
    );
  }

  const handleProceed = () => {
    navigation.navigate('NewTenantForm', { propertyId, category: 'residential' });
  };

  const formatDimensions = (length, breadth, totalArea) => {
    if (length && breadth) {
      const formattedLength = isNaN(length) ? length : Math.round(Number(length));
      const formattedBreadth = isNaN(breadth) ? breadth : Math.round(Number(breadth));
      const formattedArea = isNaN(totalArea) ? totalArea : Math.round(Number(totalArea));
      
      return `${formattedLength} × ${formattedBreadth} = ${formattedArea} sq.ft`;
    }
    return 'N/A';
  };
  
  const renderConditions = (conditionNumbers) => {
    if (!conditionNumbers) {
      return (
        <Text style={propertyDetailsStyles.value}>No conditions specified</Text>
      );
    }
    
    let parsedConditionNumbers = conditionNumbers;
    if (typeof conditionNumbers === 'string') {
      try {
        parsedConditionNumbers = JSON.parse(conditionNumbers);
      } catch (error) {
        console.error('Error parsing condition numbers:', error);
        return (
          <Text style={propertyDetailsStyles.value}>Error loading conditions</Text>
        );
      }
    }
    
    const predefinedConditions = [
      'No structural changes without owner’s permission.',
      'Water and electricity bills must be paid by the tenant.',
      'Advance/deposit amount is non-refundable.',
      'No damage to property, repair costs will be deducted from the deposit.',
      'Pets are not allowed on the premises.',
      'Only Vegetarian.'
    ];
    
    if (!Array.isArray(parsedConditionNumbers) || parsedConditionNumbers.length === 0) {
      return (
        <Text style={propertyDetailsStyles.value}>No conditions specified</Text>
      );
    }
    
    return Array.isArray(parsedConditionNumbers) ? parsedConditionNumbers.map((conditionNum, index) => {
      const conditionText = predefinedConditions[conditionNum - 1];
      
      if (!conditionText) {
        return null;
      }
      
      return (
        <View key={index} style={propertyDetailsStyles.conditionRow}>
          <Text style={propertyDetailsStyles.conditionText}>{conditionText}</Text>
        </View>
      );
    }) : null;
  };

  return (
    <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <ScrollView 
          style={propertyDetailsStyles.scrollContainer}
          contentContainerStyle={propertyDetailsStyles.scrollContentContainer}
          nestedScrollEnabled={true}
        >
          <Text style={[categoryContentStyles.pageTitle, { color: colors.text }]}>Property Details</Text>
          
          {Array.isArray(property.images) && property.images.length > 0 && (
            <View style={{ marginVertical: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {property.images.map((imgRaw, idx) => {
                  if (!imgRaw || typeof imgRaw !== 'string') return null;
                  const img = imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`;
                  return (
                  <TouchableOpacity 
                    key={idx} 
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      setCurrentImageIndex(idx);
                      setIsImageViewVisible(true);
                    }}
                  >
                    <View style={{ width: 200, height: 140, backgroundColor: dark ? '#333' : '#eee', borderRadius: 8, overflow: 'hidden' }}>
                      <Text style={{ position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderBottomRightRadius: 8 }}>
                        {idx + 1}/{property.images.length}
                      </Text>
                      <Image source={{ uri: img }} style={{ width: 200, height: 140 }} />
                    </View>
                  </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <ImageView
                images={property.images.map(imgRaw => ({
                  uri: imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`
                }))}
                imageIndex={currentImageIndex}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
              />
            </View>
          )}
          
          <View style={[propertyDetailsStyles.section, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={[propertyDetailsStyles.sectionTitle, { color: colors.text, borderBottomColor: colors.primary }]}>💰 Payment Information</Text>
            
            {property.paymentDetails?.leaseAmount ? (
              <View style={[propertyDetailsStyles.firstDetailRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Lease Amount:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>₹{property.paymentDetails.leaseAmount}</Text>
              </View>
            ) : (
              <>
                <View style={[propertyDetailsStyles.firstDetailRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                  <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Advance Amount:</Text>
                  <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>₹{property.paymentDetails?.advanceAmount || 'N/A'}</Text>
                </View>
                <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Monthly Rent:</Text>
                  <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>₹{property.paymentDetails?.monthlyRent || 'N/A'}</Text>
                </View>
              </>
            )}
            
            <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Agreement:</Text>
              <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>N/A</Text>
            </View>
          </View>
          
          {property.houseDetails && (
            <View style={[propertyDetailsStyles.section, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={[propertyDetailsStyles.sectionTitle, { color: colors.text, borderBottomColor: colors.primary }]}>🏠 House Details</Text>
              <View style={[propertyDetailsStyles.firstDetailRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Facing Direction:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.facingDirection || 'N/A'}</Text>
              </View>
              
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Hall Size (L X B):</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                  {formatDimensions(
                    property.houseDetails.hallLength,
                    property.houseDetails.hallBreadth,
                    property.houseDetails.hallTotalArea
                  )}
                </Text>
              </View>
              
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Kitchen Size (L X B):</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                  {formatDimensions(
                    property.houseDetails.kitchenLength,
                    property.houseDetails.kitchenBreadth,
                    property.houseDetails.kitchenTotalArea
                  )}
                </Text>
              </View>
              
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Bedrooms:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.numberOfBedrooms || 'N/A'}</Text>
              </View>
              
              {Array.isArray(property.houseDetails?.bedrooms) && property.houseDetails.bedrooms.map((bedroom, index) => (
                <View key={index} style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                  <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Bedroom {bedroom?.bedroomNumber || (index + 1)} (L X B):</Text>
                  <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                    {formatDimensions(
                      bedroom?.length,
                      bedroom?.breadth,
                      bedroom?.totalArea
                    )}
                  </Text>
                </View>
              ))}
              
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Bathrooms:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.numberOfBathrooms || 'N/A'}</Text>
              </View>
              
              {property.houseDetails?.numberOfBathrooms && (
                Array.from({ length: Math.max(0, parseInt(property.houseDetails.numberOfBathrooms) || 0) }, (_, index) => {
                  const bathroomType = property.houseDetails?.[`bathroom${index + 1}Type`];
                  const bathroomAccess = property.houseDetails?.[`bathroom${index + 1}Access`];
                  return (
                    <View key={index + 1} style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                      <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Bathroom {index + 1}:</Text>
                      <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                        {(bathroomAccess && bathroomType) ? `${bathroomAccess} - ${bathroomType}` : 
                         (bathroomAccess ? bathroomAccess : 
                         (bathroomType || 'N/A'))}
                      </Text>
                    </View>
                  );
                })
              )}
              
              {property.houseDetails && (
                <>
                  <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                    <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Parking (2-Wheeler):</Text>
                    <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                      {(property.houseDetails.parking2Wheeler !== undefined && property.houseDetails.parking2Wheeler !== null) 
                        ? property.houseDetails.parking2Wheeler 
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                    <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Parking (4-Wheeler):</Text>
                    <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                      {(property.houseDetails.parking4Wheeler !== undefined && property.houseDetails.parking4Wheeler !== null) 
                        ? property.houseDetails.parking4Wheeler 
                        : 'N/A'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
          
          {property.houseDetails && (
            <View style={[propertyDetailsStyles.section, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={[propertyDetailsStyles.sectionTitle, { color: colors.text, borderBottomColor: colors.primary }]}>🏢 Property Specifications</Text>
              <View style={[propertyDetailsStyles.firstDetailRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Facing Direction:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.facingDirection || 'N/A'}</Text>
              </View>
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Floor Number:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.floorNumber || 'N/A'}</Text>
              </View>
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Built-up Area:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                  {property.area ? `${property.area}` : 'N/A'}
                </Text>
              </View>
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Total Bedrooms:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.numberOfBedrooms || 'N/A'}</Text>
              </View>
              <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
                <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Total Bathrooms:</Text>
                <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>{property.houseDetails.numberOfBathrooms || 'N/A'}</Text>
              </View>
            </View>
          )}
          
          <View style={[propertyDetailsStyles.section, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={[propertyDetailsStyles.sectionTitle, { color: colors.text, borderBottomColor: colors.primary }]}>📍 Location & Nearby Amenities</Text>
            <View style={[propertyDetailsStyles.firstDetailRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Street Size:</Text>
              <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                {property?.streetSize ? `${property.streetSize} ft` : 'N/A'}
              </Text>
            </View>
            <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Bus Stop:</Text>
              <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                {property?.nearbyBusStop ? `${property.nearbyBusStop}${property?.nearbyBusStopDistance ? ` - ${property.nearbyBusStopDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
            <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>School:</Text>
              <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                {property?.nearbySchool ? `${property.nearbySchool}${property?.nearbySchoolDistance ? ` - ${property.nearbySchoolDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
            <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Shopping Mall:</Text>
              <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                {property?.nearbyShoppingMall ? `${property.nearbyShoppingMall}${property?.nearbyShoppingMallDistance ? ` - ${property.nearbyShoppingMallDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
            <View style={[propertyDetailsStyles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[propertyDetailsStyles.label, { color: colors.subText }]}>Bank:</Text>
              <Text style={[propertyDetailsStyles.value, { color: colors.text }]}>
                {property?.nearbyBank ? `${property.nearbyBank}${property?.nearbyBankDistance ? ` - ${property.nearbyBankDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={[propertyDetailsStyles.section, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={[propertyDetailsStyles.sectionTitle, { color: colors.text, borderBottomColor: colors.primary }]}>✅ Property Conditions</Text>
            {renderConditions(property?.conditionNumbers)}
          </View>

        </ScrollView>
        
        <View style={categoryContentStyles.buttonRow}>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.cancelButton, { backgroundColor: dark ? '#444' : '#6c757d' }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={categoryContentStyles.buttonText}>Back to Properties</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleProceed}
          >
            <Text style={categoryContentStyles.buttonText}>Click OK to Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
}
