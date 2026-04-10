import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyDetailsStyles from '../../residential/tenant/propertyDetailsStyles';
import { getPropertyDetails } from './api';

export default function PropertyDetails({ route }) {
  const navigation = useNavigation();
  const { propertyId } = route.params || {};
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  const API_HOST = API_BASE_URL.replace(/\/api$/, '');

  useEffect(() => {
    if (propertyId) fetchDetails();
  }, [propertyId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getPropertyDetails(propertyId);
      setProperty(data || null);
    } catch (error) {
      console.error('Error fetching business property details:', error);
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    navigation.navigate('NewTenantForm', { propertyId, category: 'business' });
  };

  if (loading) return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}><Text>Loading...</Text></View>
      <Footer />
    </View>
  );

  if (!property) return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}><Text>Property not found</Text></View>
      <Footer />
    </View>
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <ScrollView 
        style={propertyDetailsStyles.scrollContainer}
        contentContainerStyle={propertyDetailsStyles.scrollContentContainer}
      >
        <Text style={categoryContentStyles.pageTitle}>{property?.propertySpecs?.property_type || 'Business Property'}</Text>
        
        {/* Images Gallery */}
        {Array.isArray(property?.images) && property.images.length > 0 && (
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
                    <View style={{ width: 200, height: 140, backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden' }}>
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

        {/* Property Overview */}
        <View style={propertyDetailsStyles.section}>
          <Text style={propertyDetailsStyles.sectionTitle}>Property Overview</Text>
          <View style={propertyDetailsStyles.firstDetailRow}>
            <Text style={propertyDetailsStyles.label}>Location</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.area || property?.addressDetails?.city || 'Unknown'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Owner</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.name_of_person || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Monthly Rent</Text>
            <Text style={propertyDetailsStyles.value}>₹{property?.paymentInfo?.monthly_rent || 'N/A'}</Text>
          </View>
        </View>

        {/* Address & Location */}
        <View style={propertyDetailsStyles.section}>
          <Text style={propertyDetailsStyles.sectionTitle}>📍 Address & Location</Text>
          <View style={propertyDetailsStyles.firstDetailRow}>
            <Text style={propertyDetailsStyles.label}>Door Number</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.door_no || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Street</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.street || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Area</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.area || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>City</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.city || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Pincode</Text>
            <Text style={propertyDetailsStyles.value}>{property?.addressDetails?.pincode || 'N/A'}</Text>
          </View>
        </View>

        {/* Property Specifications */}
        <View style={propertyDetailsStyles.section}>
          <Text style={propertyDetailsStyles.sectionTitle}>🏢 Property Specifications</Text>
          <View style={propertyDetailsStyles.firstDetailRow}>
            <Text style={propertyDetailsStyles.label}>Door Facing</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.door_facing || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Property Type</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.property_type || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Total Area (sq ft)</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.totalArea || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Length (ft)</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.length_feet || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Breadth (ft)</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.breadth_feet || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Restroom Available</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.restroom_available ? 'Yes' : 'No'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Floor Number</Text>
            <Text style={propertyDetailsStyles.value}>{property?.propertySpecs?.floor_number || 'N/A'}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={propertyDetailsStyles.section}>
          <Text style={propertyDetailsStyles.sectionTitle}>💰 Payment Information</Text>
          <View style={propertyDetailsStyles.firstDetailRow}>
            <Text style={propertyDetailsStyles.label}>Advance Amount</Text>
            <Text style={propertyDetailsStyles.value}>₹{property?.paymentInfo?.advance_amount || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Monthly Rent</Text>
            <Text style={propertyDetailsStyles.value}>₹{property?.paymentInfo?.monthly_rent || 'N/A'}</Text>
          </View>
          <View style={propertyDetailsStyles.detailRow}>
            <Text style={propertyDetailsStyles.label}>Lease Amount</Text>
            <Text style={propertyDetailsStyles.value}>₹{property?.paymentInfo?.lease_amount || 'N/A'}</Text>
          </View>
        </View>

      </ScrollView>

      {/* Button Row */}
      <View style={categoryContentStyles.buttonRow}>
        <TouchableOpacity 
          style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={categoryContentStyles.buttonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
          onPress={handleProceed}
        >
          <Text style={categoryContentStyles.buttonText}>Click OK to Proceed</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}
