import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, Image, Modal, Platform, Dimensions, StyleSheet } from 'react-native';
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
  const screen = Dimensions.get('window');

  const resolveImageUri = (imgRaw) => {
    if (!imgRaw || typeof imgRaw !== 'string') return null;
    return imgRaw.startsWith('http') ? imgRaw : `${API_HOST}${imgRaw}`;
  };

  const galleryImages = useMemo(() => {
    if (!Array.isArray(property?.images)) return [];
    return property.images
      .map(resolveImageUri)
      .filter(Boolean)
      .map((uri) => ({ uri }));
  }, [property?.images, API_HOST]);

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
        subtitle="Review listing details"
      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <ScrollView
        style={propertyDetailsStyles.scrollContainer}
        contentContainerStyle={propertyDetailsStyles.scrollContentContainer}
        nestedScrollEnabled
      >
        
        {/* Images Gallery */}
        {galleryImages.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {galleryImages.map((img, idx) => (
                  <TouchableOpacity
                    key={`${img.uri}-${idx}`}
                    style={{ marginRight: 10 }}
                    activeOpacity={0.85}
                    onPress={() => {
                      setCurrentImageIndex(idx);
                      setIsImageViewVisible(true);
                    }}
                  >
                    <View style={{ width: 200, height: 140, backgroundColor: dark ? '#333' : '#eee', borderRadius: 8, overflow: 'hidden' }}>
                      <Text style={{ position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderBottomRightRadius: 8 }}>
                        {idx + 1}/{galleryImages.length}
                      </Text>
                      <Image source={img} style={{ width: 200, height: 140 }} resizeMode="cover" />
                    </View>
                  </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Property Overview */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Property Overview</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Owner</Text>
            <Text style={tps.value}>{property?.addressDetails?.name_of_person || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Monthly Rent</Text>
            <Text style={tps.value}>₹{property?.paymentInfo?.monthly_rent || 'N/A'}</Text>
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
      </View>

      {galleryImages.length > 0 && Platform.OS === 'web' ? (
        <Modal
          visible={isImageViewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsImageViewVisible(false)}
        >
          <View style={imageViewerStyles.backdrop}>
            <TouchableOpacity
              style={imageViewerStyles.closeBtn}
              onPress={() => setIsImageViewVisible(false)}
            >
              <Text style={imageViewerStyles.closeText}>✕</Text>
            </TouchableOpacity>
            {galleryImages.length > 1 && currentImageIndex > 0 && (
              <TouchableOpacity
                style={[imageViewerStyles.navBtn, imageViewerStyles.navLeft]}
                onPress={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
              >
                <Text style={imageViewerStyles.navText}>‹</Text>
              </TouchableOpacity>
            )}
            {galleryImages.length > 1 && currentImageIndex < galleryImages.length - 1 && (
              <TouchableOpacity
                style={[imageViewerStyles.navBtn, imageViewerStyles.navRight]}
                onPress={() => setCurrentImageIndex((i) => Math.min(galleryImages.length - 1, i + 1))}
              >
                <Text style={imageViewerStyles.navText}>›</Text>
              </TouchableOpacity>
            )}
            <Image
              source={galleryImages[Math.min(currentImageIndex, galleryImages.length - 1)]}
              style={{ width: screen.width, height: screen.height * 0.85 }}
              resizeMode="contain"
            />
            {galleryImages.length > 1 && (
              <Text style={imageViewerStyles.counter}>
                {Math.min(currentImageIndex, galleryImages.length - 1) + 1} / {galleryImages.length}
              </Text>
            )}
          </View>
        </Modal>
      ) : galleryImages.length > 0 ? (
        <ImageView
          images={galleryImages}
          imageIndex={Math.min(currentImageIndex, galleryImages.length - 1)}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
          presentationStyle="overFullScreen"
          animationType="fade"
          swipeToCloseEnabled
          doubleTapToZoomEnabled
          backgroundColor="#000000"
        />
      ) : null}

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

const imageViewerStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    padding: 16,
  },
  navLeft: { left: 8 },
  navRight: { right: 8 },
  navText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '300',
  },
  counter: {
    position: 'absolute',
    bottom: 32,
    color: '#fff',
    fontSize: 14,
  },
});
