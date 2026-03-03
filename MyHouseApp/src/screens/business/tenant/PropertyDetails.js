import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getPropertyDetails } from './api';

const styles = StyleSheet.create({
  scrollContent: {
    padding: 15,
    alignItems: 'flex-start',
    paddingBottom: 110,
    width: '100%',
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
    width: '100%',
  },
  detailBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
    width: '100%',
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    flex: 1.2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    paddingLeft: 10,
  },
});

export default function PropertyDetails({ route }) {
  const navigation = useNavigation();
  const { propertyId } = route.params || {};
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propertyId) fetchDetails();
  }, [propertyId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getPropertyDetails(propertyId);
      setProperty(data || {});
    } catch (error) {
      console.error('Error fetching business property details:', error);
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}><Text style={propertyListStyles.loadingText}>Loading property details...</Text></View>
      <Footer />
    </View>
  );

  if (!property) return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}><Text style={propertyListStyles.noPropertiesText}>Property not found</Text></View>
      <Footer />
    </View>
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={categoryContentStyles.pageTitle}>{property?.propertyType || 'Business Property'}</Text>

        {/* Summary Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.boxTitle}>Property Overview</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{property.area || property.city || 'Unknown'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Owner</Text>
            <Text style={styles.detailValue}>{property?.ownerName || property?.name_of_person || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Rent</Text>
            <Text style={styles.detailValue}>₹{property?.monthlyRent || property?.monthly_rent || 'N/A'}</Text>
          </View>
        </View>

        {/* All details displayed directly */}

        {/* Box 1: Address & Location Details */}
        <View style={styles.detailBox}>
              <Text style={styles.boxTitle}>📍 Address & Location</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Door Number</Text>
                <Text style={styles.detailValue}>{property?.doorNo || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Street</Text>
                <Text style={styles.detailValue}>{property?.street || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Area</Text>
                <Text style={styles.detailValue}>{property?.area || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>City</Text>
                <Text style={styles.detailValue}>{property?.city || 'N/A'}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Pincode</Text>
                <Text style={styles.detailValue}>{property?.pincode || 'N/A'}</Text>
              </View>
            </View>

            {/* Box 2: Property Specifications */}
            <View style={styles.detailBox}>
              <Text style={styles.boxTitle}>🏢 Property Specifications</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Door Facing</Text>
                <Text style={styles.detailValue}>{property?.doorFacing || property?.door_facing || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Property Type</Text>
                <Text style={styles.detailValue}>{property?.propertyType || property?.property_type || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total Area (sq ft)</Text>
                <Text style={styles.detailValue}>{property?.totalArea || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Length (ft)</Text>
                <Text style={styles.detailValue}>{property?.lengthFeet || property?.length_feet || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Breadth (ft)</Text>
                <Text style={styles.detailValue}>{property?.breadthFeet || property?.breadth_feet || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Restroom Available</Text>
                <Text style={styles.detailValue}>{property?.restroomAvailable ? 'Yes' : (property?.restroom_available === 0 ? 'No' : 'N/A')}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Floor Number</Text>
                <Text style={styles.detailValue}>{property?.floorNumber || property?.floor_number || 'N/A'}</Text>
              </View>
            </View>

            {/* Box 3: Payment Information */}
            <View style={styles.detailBox}>
              <Text style={styles.boxTitle}>💰 Payment Information</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Advance Amount</Text>
                <Text style={styles.detailValue}>₹{property?.advanceAmount || property?.advance_amount || 'N/A'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monthly Rent</Text>
                <Text style={styles.detailValue}>₹{property?.monthlyRent || property?.monthly_rent || 'N/A'}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}> 
                <Text style={styles.detailLabel}>Lease Amount</Text>
                <Text style={styles.detailValue}>₹{property?.leaseAmount || property?.lease_amount || 'N/A'}</Text>
              </View>
            </View>

        <TouchableOpacity style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} onPress={() => navigation.goBack()}>
          <Text style={categoryContentStyles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}
