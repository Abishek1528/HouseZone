import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAllProperties } from './api';

const PropertyCard = ({ property, onViewDetails }) => {
  if (!property) return null;
  return (
    <View style={propertyListStyles.card}>
      <View style={propertyListStyles.imagePlaceholder}>
        <Text style={propertyListStyles.imageText}>Image</Text>
      </View>
      <View style={propertyListStyles.detailsContainer}>
        <Text style={propertyListStyles.location}>{property?.area || property?.city || 'Unknown'}</Text>
        <View style={propertyListStyles.propertyInfo}>
          <Text style={propertyListStyles.bedroomsText}>{property?.propertyType || 'N/A'}</Text>
          <Text style={propertyListStyles.rentText}>₹{property?.leaseAmount ? property.leaseAmount : (property?.monthlyRent || 'N/A')}{property?.leaseAmount ? '' : '/month'}</Text>
        </View>
        <TouchableOpacity
          style={propertyListStyles.viewMoreButton}
          onPress={() => onViewDetails(property?.id)}
        >
          <Text style={propertyListStyles.viewMoreText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PropertiesList() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getAllProperties(filters);
      console.log('Business properties raw:', data);

      // Normalize fields to match residential UI expectations
      const normalized = (data || []).map(item => ({
        id: item.id,
        area: item.area || item.city || '',
        propertyType: item.propertyType || item.property_type || '',
        monthlyRent: item.monthlyRent || item.monthly_rent || item.rent || null,
        leaseAmount: item.leaseAmount || item.lease_amount || null,
        ownerName: item.ownerName || item.name_of_person || '',
        contactNo: item.contactNo || item.contact_no || ''
      }));

      console.log('Business properties normalized:', normalized);
      setProperties(normalized);
    } catch (error) {
      console.error('Error loading business properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigation.navigate('BusinessPropertyDetails', { propertyId: id });
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Available Business Properties</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : properties.length === 0 ? (
          <Text>No properties found</Text>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => (item.id || Math.random().toString()).toString()}
            renderItem={({ item }) => <PropertyCard property={item} onViewDetails={handleViewDetails} />}
            style={propertyListStyles.list}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}
