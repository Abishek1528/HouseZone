import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPropertyDetails } from './api';
import propertyDetailsStyles from './propertyDetailsStyles';

export default function PropertyDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { propertyId } = route.params || {};
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyId) {
      loadPropertyDetails();
    }
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching property details for ID:', propertyId);
      const data = await getPropertyDetails(propertyId);
      console.log('Received property data:', data);
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
      <View style={categoryContentStyles.container}>
        <Header />
        <View style={categoryContentStyles.content}>
          <Text style={propertyDetailsStyles.loadingText}>Loading property details...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={categoryContentStyles.container}>
        <Header />
        <View style={categoryContentStyles.content}>
          <Text style={propertyDetailsStyles.errorText}>Property not found</Text>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
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
    // Navigate to the TenantDetails page
    navigation.navigate('TenantDetails');
  };

  // Helper function to format dimensions - now displays whole numbers
  const formatDimensions = (length, breadth, totalArea) => {
    if (length && breadth) {
      // Convert to whole numbers if they are numeric
      const formattedLength = isNaN(length) ? length : Math.round(Number(length));
      const formattedBreadth = isNaN(breadth) ? breadth : Math.round(Number(breadth));
      const formattedArea = isNaN(totalArea) ? totalArea : Math.round(Number(totalArea));
      
      return `${formattedLength} × ${formattedBreadth} = ${formattedArea} sq.ft`;
    }
    return 'N/A';
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <ScrollView style={propertyDetailsStyles.scrollContainer}>
          <Text style={categoryContentStyles.pageTitle}>Property Details</Text>
          
          {/* Payment Details */}
          <View style={propertyDetailsStyles.section}>
            <Text style={propertyDetailsStyles.sectionTitle}>Payment Information</Text>
            
            {/* Display lease amount if available, otherwise show advance and monthly rent */}
            {property.paymentDetails?.leaseAmount ? (
              <View style={propertyDetailsStyles.firstDetailRow}>
                <Text style={propertyDetailsStyles.label}>Lease Amount:</Text>
                <Text style={propertyDetailsStyles.value}>₹{property.paymentDetails.leaseAmount}</Text>
              </View>
            ) : (
              <>
                <View style={propertyDetailsStyles.firstDetailRow}>
                  <Text style={propertyDetailsStyles.label}>Advance Amount:</Text>
                  <Text style={propertyDetailsStyles.value}>₹{property.paymentDetails?.advanceAmount || 'N/A'}</Text>
                </View>
                <View style={propertyDetailsStyles.detailRow}>
                  <Text style={propertyDetailsStyles.label}>Monthly Rent:</Text>
                  <Text style={propertyDetailsStyles.value}>₹{property.paymentDetails?.monthlyRent || 'N/A'}</Text>
                </View>
              </>
            )}
            
            <View style={propertyDetailsStyles.detailRow}>
              <Text style={propertyDetailsStyles.label}>Agreement:</Text>
              <Text style={propertyDetailsStyles.value}>N/A</Text>
            </View>
          </View>
          
          {/* House Details */}
          {property.houseDetails && (
            <View style={propertyDetailsStyles.section}>
              <Text style={propertyDetailsStyles.sectionTitle}>House Details</Text>
              <View style={propertyDetailsStyles.firstDetailRow}>
                <Text style={propertyDetailsStyles.label}>Facing Direction:</Text>
                <Text style={propertyDetailsStyles.value}>{property.houseDetails.facingDirection || 'N/A'}</Text>
              </View>
              
              {/* Hall Details */}
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Hall Size (L X B):</Text>
                <Text style={propertyDetailsStyles.value}>
                  {formatDimensions(
                    property.houseDetails.hallLength,
                    property.houseDetails.hallBreadth,
                    property.houseDetails.hallTotalArea
                  )}
                </Text>
              </View>
              
              {/* Kitchen Details */}
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Kitchen Size (L X B):</Text>
                <Text style={propertyDetailsStyles.value}>
                  {formatDimensions(
                    property.houseDetails.kitchenLength,
                    property.houseDetails.kitchenBreadth,
                    property.houseDetails.kitchenTotalArea
                  )}
                </Text>
              </View>
              
              {/* Bedroom Details */}
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Bedrooms:</Text>
                <Text style={propertyDetailsStyles.value}>{property.houseDetails.numberOfBedrooms || 'N/A'}</Text>
              </View>
              
              {property.houseDetails.bedrooms && property.houseDetails.bedrooms.map((bedroom, index) => (
                <View key={index} style={propertyDetailsStyles.detailRow}>
                  <Text style={propertyDetailsStyles.label}>Bedroom {bedroom.bedroomNumber} (L X B):</Text>
                  <Text style={propertyDetailsStyles.value}>
                    {formatDimensions(
                      bedroom.length,
                      bedroom.breadth,
                      bedroom.totalArea
                    )}
                  </Text>
                </View>
              ))}
              
              {/* Bathroom Details */}
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Bathrooms:</Text>
                <Text style={propertyDetailsStyles.value}>{property.houseDetails.numberOfBathrooms || 'N/A'}</Text>
              </View>
              
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Bathroom 1 Type:</Text>
                <Text style={propertyDetailsStyles.value}>{property.houseDetails.bathroom1Type || 'N/A'}</Text>
              </View>
              
              {property.houseDetails.bathroom2Type !== undefined && (
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Bathroom 2 Type:</Text>
                <Text style={propertyDetailsStyles.value}>{property.houseDetails.bathroom2Type || 'N/A'}</Text>
              </View>
              )}
              
              {property.houseDetails.bathroom3Type !== undefined && (
              <View style={propertyDetailsStyles.detailRow}>
                <Text style={propertyDetailsStyles.label}>Bathroom 3 Type:</Text>
                <Text style={propertyDetailsStyles.value}>{property.houseDetails.bathroom3Type || 'N/A'}</Text>
              </View>
              )}
              
              {/* Parking Details */}
              {property.houseDetails && (
                <>
                  <View style={propertyDetailsStyles.detailRow}>
                    <Text style={propertyDetailsStyles.label}>Parking (2-Wheeler):</Text>
                    <Text style={propertyDetailsStyles.value}>
                      {(property.houseDetails.parking2Wheeler !== undefined && property.houseDetails.parking2Wheeler !== null) 
                        ? property.houseDetails.parking2Wheeler 
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={propertyDetailsStyles.detailRow}>
                    <Text style={propertyDetailsStyles.label}>Parking (4-Wheeler):</Text>
                    <Text style={propertyDetailsStyles.value}>
                      {(property.houseDetails.parking4Wheeler !== undefined && property.houseDetails.parking4Wheeler !== null) 
                        ? property.houseDetails.parking4Wheeler 
                        : 'N/A'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
          
          {/* Location & Nearby Amenities Section */}
          <View style={propertyDetailsStyles.section}>
            <Text style={propertyDetailsStyles.sectionTitle}>Location & Nearby Amenities</Text>
            <View style={propertyDetailsStyles.firstDetailRow}>
              <Text style={propertyDetailsStyles.label}>Street Size:</Text>
              <Text style={propertyDetailsStyles.value}>
                {property.streetSize ? `${property.streetSize} ft` : 'N/A'}
              </Text>
            </View>
            <View style={propertyDetailsStyles.detailRow}>
              <Text style={propertyDetailsStyles.label}>Nearby Bus Stop:</Text>
              <Text style={propertyDetailsStyles.value}>
                {property.nearbyBusStop ? `${property.nearbyBusStop} km` : 'N/A'}
              </Text>
            </View>
            <View style={propertyDetailsStyles.detailRow}>
              <Text style={propertyDetailsStyles.label}>Nearby School:</Text>
              <Text style={propertyDetailsStyles.value}>
                {property.nearbySchool ? `${property.nearbySchool} km` : 'N/A'}
              </Text>
            </View>
            <View style={propertyDetailsStyles.detailRow}>
              <Text style={propertyDetailsStyles.label}>Nearby Shopping Mall:</Text>
              <Text style={propertyDetailsStyles.value}>
                {property.nearbyShoppingMall ? `${property.nearbyShoppingMall} km` : 'N/A'}
              </Text>
            </View>
            <View style={propertyDetailsStyles.detailRow}>
              <Text style={propertyDetailsStyles.label}>Nearby Bank:</Text>
              <Text style={propertyDetailsStyles.value}>
                {property.nearbyBank ? `${property.nearbyBank} km` : 'N/A'}
              </Text>
            </View>
          </View>

        </ScrollView>
        
        {/* Button Row with Back and Proceed buttons */}
        <View style={categoryContentStyles.buttonRow}>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={categoryContentStyles.buttonText}>Back to Properties</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
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