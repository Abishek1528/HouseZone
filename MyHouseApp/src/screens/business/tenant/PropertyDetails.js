import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import propertyDetailsStyles from '../../residential/tenant/propertyDetailsStyles';
import { getPropertyDetails } from './api';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';

export default function PropertyDetails({ route }) {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
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
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader title="Business Property" subtitle="Loading…" />
      <Text style={tps.loadingText}>Loading...</Text>
      <Footer />
    </View>
  );

  if (!property) return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader title="Business Property" subtitle="Not found" />
      <Text style={propertyDetailsStyles.errorText}>Property not found</Text>
      <Footer />
    </View>
  );

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title={property?.propertySpecs?.property_type || 'Business Property'}
        subtitle={property?.addressDetails?.area || 'Review listing details'}
      />
      <ScrollView
        style={propertyDetailsStyles.scrollContainer}
        contentContainerStyle={[propertyDetailsStyles.scrollContentContainer, { paddingHorizontal: 16 }]}
      >
        
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
              images={property.images
                .filter(imgRaw => typeof imgRaw === 'string' && imgRaw)
                .map(imgRaw => ({
                  uri: imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`
                }))
              }
              imageIndex={currentImageIndex}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          </View>
        )}

        {/* Property Overview */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Property Overview</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Location</Text>
            <Text style={tps.value}>{property?.addressDetails?.area || property?.addressDetails?.city || 'Unknown'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Owner</Text>
            <Text style={tps.value}>{property?.addressDetails?.name_of_person || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Monthly Rent</Text>
            <Text style={tps.value}>₹{property?.paymentInfo?.monthly_rent || 'N/A'}</Text>
          </View>
        </View>

        {/* Address & Location */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>📍 Address & Location</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Door Number</Text>
            <Text style={tps.value}>{property?.addressDetails?.door_no || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Street</Text>
            <Text style={tps.value}>{property?.addressDetails?.street || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Area</Text>
            <Text style={tps.value}>{property?.addressDetails?.area || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>City</Text>
            <Text style={tps.value}>{property?.addressDetails?.city || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Pincode</Text>
            <Text style={tps.value}>{property?.addressDetails?.pincode || 'N/A'}</Text>
          </View>
        </View>

        {/* Property Specifications */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>🏢 Property Specifications</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Door Facing</Text>
            <Text style={tps.value}>{property?.propertySpecs?.door_facing || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Property Type</Text>
            <Text style={tps.value}>{property?.propertySpecs?.property_type || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Total Area (sq ft)</Text>
            <Text style={tps.value}>{property?.propertySpecs?.totalArea || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Length (ft)</Text>
            <Text style={tps.value}>{property?.propertySpecs?.length_feet || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Breadth (ft)</Text>
            <Text style={tps.value}>{property?.propertySpecs?.breadth_feet || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Restroom Available</Text>
            <Text style={tps.value}>{property?.propertySpecs?.restroom_available ? 'Yes' : 'No'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Floor Number</Text>
            <Text style={tps.value}>{property?.propertySpecs?.floor_number || 'N/A'}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>💰 Payment Information</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Advance Amount</Text>
            <Text style={tps.value}>₹{property?.paymentInfo?.advance_amount || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Monthly Rent</Text>
            <Text style={tps.value}>₹{property?.paymentInfo?.monthly_rent || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Lease Amount</Text>
            <Text style={tps.value}>₹{property?.paymentInfo?.lease_amount || 'N/A'}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={[tps.bottomBar, { paddingHorizontal: 16, paddingBottom: 12 }]}>
        <TouchableOpacity style={tps.btnOutline} onPress={() => navigation.goBack()}>
          <Text style={tps.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tps.btnPrimary} onPress={handleProceed}>
          <Text style={tps.btnText}>Click OK to Proceed</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}
