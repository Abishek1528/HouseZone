import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useRoute } from '@react-navigation/native';
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getMachineryDetails } from "./api"; // We will create this API function

export default function MachineryDetailsPage() {
  const route = useRoute();
  const { machineryId } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to normalize image URLs
  const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    
    // If it's just a filename, prepend the base upload URL
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

    if (machineryId) {
      fetchDetails();
    }
  }, [machineryId]);

  if (loading) {
    return <View style={styles.centered}><Text>Loading details...</Text></View>;
  }

  if (!details) {
    return <View style={styles.centered}><Text>No details found for this machinery.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{details.name || "Machinery Details"}</Text>

        {details.images && details.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
            {details.images.map((uri, index) => {
              const normalizedUri = normalizeImageUrl(uri);
              if (!normalizedUri) return null;
              return (
                <Image key={index} source={{ uri: normalizedUri }} style={styles.image} />
              );
            })}
          </ScrollView>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Area:</Text> {details.area || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>City:</Text> {details.city || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Type:</Text> {details.type || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Model:</Text> {details.model || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Charge per Day:</Text> ₹{details.chargePerDay || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Charge per Km:</Text> ₹{details.chargePerKm || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Waiting Charge (Hour):</Text> ₹{details.waitingChargePerHour || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Waiting Charge (Night):</Text> ₹{details.waitingChargePerNight || 'N/A'}</Text>
          <Text style={styles.detailText}><Text style={styles.detailLabel}>Fixed Rate:</Text> {details.isFixed ? 'Yes' : 'No'}</Text>
        </View>

      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentContainer: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#343a40', textAlign: 'center' },
  imageScrollView: { marginBottom: 20 },
  image: { width: 300, height: 200, borderRadius: 10, marginRight: 15 },
  section: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#4A90E2', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  detailText: { fontSize: 16, color: '#555', marginBottom: 8, lineHeight: 24 },
  detailLabel: { fontWeight: 'bold', color: '#333' }
});
