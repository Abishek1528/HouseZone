import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getAllProperties } from './api';
import propertyListStyles from './propertyListStyles';

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
          <Text style={propertyListStyles.imageText}>Property Image</Text>
        </View>
      )}
      
      {/* Right side - Property details */}
      <View style={propertyListStyles.detailsContainer}>
        <Text style={propertyListStyles.location}>{property.area || 'Unknown'}</Text>
        <View style={propertyListStyles.propertyInfo}>
          <Text style={propertyListStyles.bedroomsText}>{property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}</Text>
          {/* Display lease amount if available, otherwise show monthly rent */}
          <Text style={propertyListStyles.rentText}>
            ₹{property.leaseAmount ? property.leaseAmount : (property.rent || 'N/A')}{property.leaseAmount ? '' : '/month'}
          </Text>
        </View>
        <Text style={propertyListStyles.viewMoreText} onPress={() => onViewDetails(property.id)}>View More</Text>
      </View>
    </View>
  );
};

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove }) => {
  // Don't show if no value is selected
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
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Fetching properties...');
      const data = await getAllProperties(filters);
      console.log('Properties fetched:', data);
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      Alert.alert(
        'Error', 
        `Failed to load properties: ${error.message || 'Unknown error'}. Please check your internet connection and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {};
    if (rentFilter) filters.rent = rentFilter;
    if (bedroomFilter) filters.bedrooms = bedroomFilter;
    if (areaFilter) filters.area = areaFilter;
    
    loadProperties(filters);
  }, [rentFilter, bedroomFilter, areaFilter]);

  const handleViewDetails = (propertyId) => {
    try {
      console.log('Navigating to PropertyDetails with ID:', propertyId);
      navigation.navigate('PropertyDetails', { propertyId });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to navigate to property details.');
    }
  };

  const renderProperty = ({ item }) => {
    if (!item) return null;
    return <PropertyCard property={item} onViewDetails={handleViewDetails} />;
  };

  // Get label for bedroom filter value
  const getBedroomLabel = (value) => {
    switch(value) {
      case '1': return '1 BHK';
      case '2': return '2 BHK';
      case '3': return '3 BHK';
      case '4': return '3+ BHK';
      default: return '';
    }
  };

  // Get label for rent filter value
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
      
      {/* Content */}
      <View style={categoryContentStyles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={categoryContentStyles.pageTitle}>Available Properties</Text>
          <TouchableOpacity 
            style={[propertyListStyles.searchButton, { marginBottom: 15, flexDirection: 'row', alignItems: 'center' }]}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Text style={propertyListStyles.searchButtonText}>
              {isFilterVisible ? 'Hide Filter' : 'Filter'}
            </Text>
            <Text style={[propertyListStyles.searchButtonText, { marginLeft: 5 }]}>
              {isFilterVisible ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Filter Section with Three Rectangular Boxes */}
        {isFilterVisible && (
          <View style={propertyListStyles.filterContainer}>
            <View style={propertyListStyles.filterBox}>
              <Text style={propertyListStyles.filterLabel}>Rent:</Text>
              <Picker
                selectedValue={rentFilter}
                style={propertyListStyles.picker}
                onValueChange={(itemValue) => setRentFilter(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                <Picker.Item label="2000-4000" value="2000-4000" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="4000-6000" value="4000-6000" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="6000-8000" value="6000-8000" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="8000-10000" value="8000-10000" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="10000-12000" value="10000-12000" color="#000000" style={{ fontSize: 15 }} />
              </Picker>
            </View>
            
            <View style={propertyListStyles.filterBox}>
              <Text style={propertyListStyles.filterLabel}>Bedrooms:</Text>
              <Picker
                selectedValue={bedroomFilter}
                style={propertyListStyles.picker}
                onValueChange={(itemValue) => setBedroomFilter(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                <Picker.Item label="1 BHK" value="1" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="2 BHK" value="2" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="3 BHK" value="3" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="3+ BHK" value="4" color="#000000" style={{ fontSize: 15 }} />
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
                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                <Picker.Item label="Area 1" value="Area 1" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="Area 2" value="Area 2" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="Area 3" value="Area 3" color="#000000" style={{ fontSize: 15 }} />
              </Picker>
            </View>
          </View>
        )}
        
        {/* Display selected filters horizontally with remove option */}
        <View style={propertyListStyles.selectedFiltersContainer}>
          <SelectedFilterBox 
            label="Rent" 
            value={getRentLabel(rentFilter)} 
            onRemove={() => setRentFilter('')} 
          />
          <SelectedFilterBox 
            label="Bedrooms" 
            value={getBedroomLabel(bedroomFilter)} 
            onRemove={() => setBedroomFilter('')} 
          />
          <SelectedFilterBox 
            label="Area" 
            value={areaFilter} 
            onRemove={() => setAreaFilter('')} 
          />
        </View>
        
        {/* Properties List */}
        {loading ? (
          <Text style={propertyListStyles.loadingText}>Loading properties...</Text>
        ) : properties.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No properties found</Text>
        ) : (
          <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
            style={propertyListStyles.list}
          />
        )}
      </View>
      
      <Footer />
    </View>
  );
}
