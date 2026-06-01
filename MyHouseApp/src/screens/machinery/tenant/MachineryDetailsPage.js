import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getMachineryDetails } from "./api";
import {
  tenantMachineryDetailsStyles as styles,
  getTenantPageStyles,
} from "../../../styles/tenantPageStyles";
import TenantPageHeader from "../../../shared/components/TenantPageHeader";
import { useTheme } from "../../../context/ThemeContext";

export default function MachineryDetailsPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const { machineryId } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;

    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
    const baseHost = API_BASE_URL.replace('/api', '');
    return `${baseHost}/uploads/machinery/${url.split('/').pop()}`;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMachineryDetails(machineryId);
        setDetails(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load machinery details.");
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (machineryId) fetchDetails();
  }, [machineryId]);

  const handleProceed = () => {
    navigation.navigate('NewTenantForm', { propertyId: machineryId, category: 'machinery' });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Header />
        <Text style={styles.centeredText}>Loading details...</Text>
        <Footer />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.centered}>
        <Header />
        <Text style={styles.centeredText}>No details found for this machinery.</Text>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TenantPageHeader
        title={details?.machinery_name || "Machinery Details"}
        subtitle="Review specifications and pricing"
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {Array.isArray(details?.images) && details.images.length > 0 && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
              {details.images.map((uri, index) => {
                if (!uri || typeof uri !== 'string') return null;
                const normalizedUri = normalizeImageUrl(uri);
                if (!normalizedUri) return null;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentImageIndex(index);
                      setIsImageViewVisible(true);
                    }}
                  >
                    <Image source={{ uri: normalizedUri }} style={styles.image} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <ImageView
              images={details.images
                .filter(uri => typeof uri === 'string' && uri)
                .map(uri => ({ uri: normalizeImageUrl(uri) }))
              }
              imageIndex={currentImageIndex}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          </View>
        )}

        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Location</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Area:</Text> {details?.area || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>City:</Text> {details?.city || 'N/A'}</Text>
        </View>

        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Specifications</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Type:</Text> {details?.machinery_type || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Model:</Text> {details?.machinery_model || 'N/A'}</Text>
        </View>

        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Pricing</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Charge per Day:</Text> ₹{details?.charge_per_day || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Charge per Km:</Text> ₹{details?.charge_per_km || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Waiting Charge (Hour):</Text> ₹{details?.waiting_charge_per_hour || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Waiting Charge (Night):</Text> ₹{details?.waiting_charge_per_night || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Fixed Rate:</Text> {details?.is_fixed ? 'Yes' : 'No'}</Text>
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
