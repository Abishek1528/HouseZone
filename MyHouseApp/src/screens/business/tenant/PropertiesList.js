import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAllProperties } from './api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

const PropertyCard = ({ property, onViewDetails }) => {
  if (!property) return null;
  const firstImageRaw = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
  const firstImage = firstImageRaw
    ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`)
    : null;
  return (
    <View style={propertyListStyles.card}>
      {firstImage ? (
        <Image source={{ uri: firstImage }} style={propertyListStyles.imagePlaceholder} />
      ) : (
        <View style={propertyListStyles.imagePlaceholder}>
          <Text style={propertyListStyles.imageText}>Image</Text>
        </View>
      )}
      <View style={propertyListStyles.detailsContainer}>
        <Text style={propertyListStyles.location}>{property?.area || property?.city || 'Unknown'}</Text>
        <View style={propertyListStyles.propertyInfo}>
          <Text style={propertyListStyles.bedroomsText}>{property?.property_type || 'N/A'}</Text>
          <Text style={propertyListStyles.rentText}>₹{property?.lease_amount ? property.lease_amount : (property?.monthly_rent || 'N/A')}{property?.lease_amount ? '' : '/month'}</Text>
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

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove }) => {
  if (!value) return null;
  return (
    <View style={propertyListStyles.selectedFilterBox}>
      <View style={propertyListStyles.selectedFilterContent}>
        <Text style={propertyListStyles.selectedFilterText}>
          {label}: {value}
        </Text>
        <TouchableOpacity onPress={onRemove} style={propertyListStyles.removeFilterButton}>
          <Text style={propertyListStyles.removeFilterText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PropertiesList() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentFilter, setRentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getAllProperties(filters);
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading business properties:', error);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {};
    if (rentFilter) filters.rent = rentFilter;
    if (typeFilter) filters.propertyType = typeFilter;
    if (areaFilter) filters.area = areaFilter;
    
    loadProperties(filters);
  }, [rentFilter, typeFilter, areaFilter]);

  const handleViewDetails = (id) => {
    navigation.navigate('BusinessPropertyDetails', { propertyId: id });
  };

  const getRentLabel = (value) => {
    switch(value) {
      case '2000-4000': return '₹2000-4000';
      case '4000-6000': return '₹4000-6000';
      case '6000-8000': return '₹6000-8000';
      case '8000-10000': return '₹8000-10000';
      case '10000-12000': return '₹10000-12000';
      default: return '';
    }
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Available Business Properties</Text>
        
        {/* Filter Section */}
        <View style={propertyListStyles.filterContainer}>
          <View style={propertyListStyles.filterBox}>
            <Text style={propertyListStyles.filterLabel}>Rent:</Text>
            <Picker
              selectedValue={rentFilter}
              style={propertyListStyles.picker}
              onValueChange={(itemValue) => setRentFilter(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Any" value="" color="#999999" />
              <Picker.Item label="2000-4000" value="2000-4000" />
              <Picker.Item label="4000-6000" value="4000-6000" />
              <Picker.Item label="6000-8000" value="6000-8000" />
              <Picker.Item label="8000-10000" value="8000-10000" />
              <Picker.Item label="10000-12000" value="10000-12000" />
            </Picker>
          </View>
          
          <View style={propertyListStyles.filterBox}>
            <Text style={propertyListStyles.filterLabel}>Type:</Text>
            <Picker
              selectedValue={typeFilter}
              style={propertyListStyles.picker}
              onValueChange={(itemValue) => setTypeFilter(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Any" value="" color="#999999" />
              <Picker.Item label="Shop" value="Shop" />
              <Picker.Item label="Office" value="Office" />
              <Picker.Item label="Godown" value="Godown" />
              <Picker.Item label="Industry" value="Industry" />
            </Picker>
          </View>
          
          <View style={propertyListStyles.filterBox}>
            <Text style={propertyListStyles.filterLabel}>Area:</Text>
            <Picker
              selectedValue={areaFilter}
              style={propertyListStyles.picker}
              onValueChange={(itemValue) => setAreaFilter(itemValue)}
              mode="dropdown"
            >
              <Picker.Item label="Any" value="" color="#999999" />
              <Picker.Item label="Area 1" value="Area 1" />
              <Picker.Item label="Area 2" value="Area 2" />
              <Picker.Item label="Area 3" value="Area 3" />
            </Picker>
          </View>
        </View>

        {/* Selected Filters Display */}
        <View style={propertyListStyles.selectedFiltersContainer}>
          <SelectedFilterBox 
            label="Rent" 
            value={getRentLabel(rentFilter)} 
            onRemove={() => setRentFilter('')} 
          />
          <SelectedFilterBox 
            label="Type" 
            value={typeFilter} 
            onRemove={() => setTypeFilter('')} 
          />
          <SelectedFilterBox 
            label="Area" 
            value={areaFilter} 
            onRemove={() => setAreaFilter('')} 
          />
        </View>

        {loading ? (
          <Text style={propertyListStyles.loadingText}>Loading properties...</Text>
        ) : properties.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No properties found</Text>
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
