import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ImageView from "react-native-image-viewing";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPropertyDetails } from './api';
import propertyDetailsStyles from './propertyDetailsStyles';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';

export default function PropertyDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const { colors } = tps;
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
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader title="Property Details" subtitle="Loading…" />
        <View style={propertyDetailsStyles.scrollContentContainer}>
          <Text style={tps.loadingText}>Loading property details...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader title="Property Details" subtitle="Not found" />
        <View style={propertyDetailsStyles.scrollContentContainer}>
          <Text style={propertyDetailsStyles.errorText}>Property not found</Text>
          <TouchableOpacity style={tps.btnPrimary} onPress={() => navigation.goBack()}>
            <Text style={tps.btnText}>Go Back</Text>
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

  const getPropertyImages = () => {
    const rawImages = property?.images;
    if (Array.isArray(rawImages)) {
      return rawImages.filter((img) => typeof img === 'string' && img);
    }
    if (typeof rawImages === 'string') {
      try {
        const parsed = JSON.parse(rawImages);
        if (Array.isArray(parsed)) {
          return parsed.filter((img) => typeof img === 'string' && img);
        }
      } catch (error) {
        console.error('Invalid property.images JSON format:', {
          rawImages,
          message: error?.message || error
        });
      }
    } else if (rawImages != null) {
      console.error('Unexpected property.images type:', {
        receivedType: typeof rawImages,
        rawImages
      });
    }
    return [];
  };
  
  const renderConditions = (conditionNumbers) => {
    if (!conditionNumbers) {
      return (
        <Text style={tps.value}>No conditions specified</Text>
      );
    }
    
    let parsedConditionNumbers = conditionNumbers;
    if (typeof conditionNumbers === 'string') {
      try {
        parsedConditionNumbers = JSON.parse(conditionNumbers);
      } catch (error) {
        console.error('Error parsing condition numbers:', error);
        return (
          <Text style={tps.value}>Error loading conditions</Text>
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
        <Text style={tps.value}>No conditions specified</Text>
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

  const propertyImages = getPropertyImages();

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Property Details"
        subtitle={property?.area ? `Located in ${property.area}` : "Review listing information"}
      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <ScrollView
          style={propertyDetailsStyles.scrollContainer}
          contentContainerStyle={propertyDetailsStyles.scrollContentContainer}
          nestedScrollEnabled={true}
        >
          
          {propertyImages.length > 0 && (
            <View style={{ marginVertical: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {propertyImages.map((imgRaw, idx) => {
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
                        {idx + 1}/{propertyImages.length}
                      </Text>
                      <Image source={{ uri: img }} style={{ width: 200, height: 140 }} />
                    </View>
                  </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <ImageView
                images={propertyImages.map(imgRaw => ({
                    uri: imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`
                  }))
                }
                imageIndex={Math.min(currentImageIndex, Math.max(propertyImages.length - 1, 0))}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
              />
            </View>
          )}
          
          <View style={tps.section}>
            <Text style={tps.sectionTitle}>💰 Payment Information</Text>
            
            {property.paymentDetails?.leaseAmount ? (
              <View style={tps.firstDetailRow}>
                <Text style={tps.label}>Lease Amount:</Text>
                <Text style={tps.value}>₹{property.paymentDetails.leaseAmount}</Text>
              </View>
            ) : (
              <>
                <View style={tps.firstDetailRow}>
                  <Text style={tps.label}>Advance Amount:</Text>
                  <Text style={tps.value}>₹{property.paymentDetails?.advanceAmount || 'N/A'}</Text>
                </View>
                <View style={tps.detailRow}>
                  <Text style={tps.label}>Monthly Rent:</Text>
                  <Text style={tps.value}>₹{property.paymentDetails?.monthlyRent || 'N/A'}</Text>
                </View>
              </>
            )}
            
            <View style={tps.detailRow}>
              <Text style={tps.label}>Agreement:</Text>
              <Text style={tps.value}>N/A</Text>
            </View>
          </View>
          
          {property.houseDetails && (
            <View style={tps.section}>
              <Text style={tps.sectionTitle}>🏠 House Details</Text>
              <View style={tps.firstDetailRow}>
                <Text style={tps.label}>Facing Direction:</Text>
                <Text style={tps.value}>{property.houseDetails.facingDirection || 'N/A'}</Text>
              </View>
              
              <View style={tps.detailRow}>
                <Text style={tps.label}>Hall Size (L X B):</Text>
                <Text style={tps.value}>
                  {formatDimensions(
                    property.houseDetails.hallLength,
                    property.houseDetails.hallBreadth,
                    property.houseDetails.hallTotalArea
                  )}
                </Text>
              </View>
              
              <View style={tps.detailRow}>
                <Text style={tps.label}>Kitchen Size (L X B):</Text>
                <Text style={tps.value}>
                  {formatDimensions(
                    property.houseDetails.kitchenLength,
                    property.houseDetails.kitchenBreadth,
                    property.houseDetails.kitchenTotalArea
                  )}
                </Text>
              </View>
              
              {Array.isArray(property.houseDetails?.bedrooms) && property.houseDetails.bedrooms.map((bedroom, index) => (
                <View key={index} style={tps.detailRow}>
                  <Text style={tps.label}>Bedroom {bedroom?.bedroomNumber || (index + 1)} (L X B):</Text>
                  <Text style={tps.value}>
                    {formatDimensions(
                      bedroom?.length,
                      bedroom?.breadth,
                      bedroom?.totalArea
                    )}
                  </Text>
                </View>
              ))}
              
              {property.houseDetails?.numberOfBathrooms && (
                Array.from({ length: Math.max(0, parseInt(property.houseDetails.numberOfBathrooms) || 0) }, (_, index) => {
                  const bathroomType = property.houseDetails?.[`bathroom${index + 1}Type`];
                  const bathroomAccess = property.houseDetails?.[`bathroom${index + 1}Access`];
                  return (
                    <View key={index + 1} style={tps.detailRow}>
                      <Text style={tps.label}>Bathroom {index + 1}:</Text>
                      <Text style={tps.value}>
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
                  <View style={tps.detailRow}>
                    <Text style={tps.label}>Parking (2-Wheeler):</Text>
                    <Text style={tps.value}>
                      {(property.houseDetails.parking2Wheeler !== undefined && property.houseDetails.parking2Wheeler !== null) 
                        ? property.houseDetails.parking2Wheeler 
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={tps.detailRow}>
                    <Text style={tps.label}>Parking (4-Wheeler):</Text>
                    <Text style={tps.value}>
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
            <View style={tps.section}>
              <Text style={tps.sectionTitle}>🏢 Property Specifications</Text>
              <View style={tps.firstDetailRow}>
                <Text style={tps.label}>Facing Direction:</Text>
                <Text style={tps.value}>{property.houseDetails.facingDirection || 'N/A'}</Text>
              </View>
              <View style={tps.detailRow}>
                <Text style={tps.label}>Floor Number:</Text>
                <Text style={tps.value}>{property.houseDetails.floorNumber || 'N/A'}</Text>
              </View>
              <View style={tps.detailRow}>
                <Text style={tps.label}>Built-up Area:</Text>
                <Text style={tps.value}>
                  {property.area ? `${property.area}` : 'N/A'}
                </Text>
              </View>
            </View>
          )}
          
          <View style={tps.section}>
            <Text style={tps.sectionTitle}>📍 Location & Nearby Amenities</Text>
            <View style={tps.firstDetailRow}>
              <Text style={tps.label}>Street Size:</Text>
              <Text style={tps.value}>
                {property?.streetSize ? `${property.streetSize} ft` : 'N/A'}
              </Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Bus Stop:</Text>
              <Text style={tps.value}>
                {property?.nearbyBusStop ? `${property.nearbyBusStop}${property?.nearbyBusStopDistance ? ` - ${property.nearbyBusStopDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>School:</Text>
              <Text style={tps.value}>
                {property?.nearbySchool ? `${property.nearbySchool}${property?.nearbySchoolDistance ? ` - ${property.nearbySchoolDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Shopping Mall:</Text>
              <Text style={tps.value}>
                {property?.nearbyShoppingMall ? `${property.nearbyShoppingMall}${property?.nearbyShoppingMallDistance ? ` - ${property.nearbyShoppingMallDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Bank:</Text>
              <Text style={tps.value}>
                {property?.nearbyBank ? `${property.nearbyBank}${property?.nearbyBankDistance ? ` - ${property.nearbyBankDistance} km` : ''}` : 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={tps.section}>
            <Text style={tps.sectionTitle}>✅ Property Conditions</Text>
            {renderConditions(property?.conditionNumbers)}
          </View>

        </ScrollView>
        
        <View style={tps.bottomBar}>
          <TouchableOpacity style={tps.btnOutline} onPress={() => navigation.goBack()}>
            <Text style={tps.btnOutlineText}>Back to Properties</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tps.btnPrimary} onPress={handleProceed}>
            <Text style={tps.btnText}>Click OK to Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
}
