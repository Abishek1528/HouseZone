import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getPropertyDetails } from './api';

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
      <ScrollView contentContainerStyle={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>{property?.propertyType || 'Business Property'}</Text>

        <View style={[propertyListStyles.card, { paddingVertical: 16 }]}> 
          <View style={propertyListStyles.detailsContainer}>
            <Text style={propertyListStyles.location}>{property.area || property.city || 'Unknown'}</Text>
            <Text style={propertyListStyles.infoText}>Owner: {property?.ownerName || property?.name_of_person || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Address: {property?.doorNo ? property.doorNo + ', ' : ''}{property?.street || ''} {property?.pincode ? '- ' + property.pincode : ''}</Text>
            <Text style={propertyListStyles.infoText}>City: {property?.city || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Contact: {property?.contactNo || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Door Facing: {property?.doorFacing || property?.door_facing || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Property Type: {property?.propertyType || property?.property_type || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Length (ft): {property?.lengthFeet || property?.length_feet || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Breadth (ft): {property?.breadthFeet || property?.breadth_feet || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Total Area (sq ft): {property?.totalArea || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Floor: {property?.floorNumber || property?.floor_number || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Restroom Available: {property?.restroomAvailable ? 'Yes' : (property?.restroom_available === 0 ? 'No' : 'N/A')}</Text>
            <Text style={propertyListStyles.infoText}>Advance Amount: ₹{property?.advanceAmount || property?.advance_amount || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Monthly Rent: ₹{property?.monthlyRent || property?.monthly_rent || 'N/A'}</Text>
            <Text style={propertyListStyles.infoText}>Lease Amount: ₹{property?.leaseAmount || property?.lease_amount || 'N/A'}</Text>
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
