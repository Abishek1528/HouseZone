import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAllProperties } from './api';
import { useTheme } from '../../../context/ThemeContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

const PropertyCard = ({ property, onViewDetails, colors, dark }) => {
  if (!property) return null;
  const firstImageRaw = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
  const firstImage = firstImageRaw
    ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`)
    : null;
  return (
    <View style={[propertyListStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {firstImage ? (
        <Image source={{ uri: firstImage }} style={propertyListStyles.imagePlaceholder} />
      ) : (
        <View style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0' }]}>
          <Text style={[propertyListStyles.imageText, { color: colors.subText }]}>Image</Text>
        </View>
      )}
      <View style={propertyListStyles.detailsContainer}>
        <Text style={[propertyListStyles.location, { color: colors.text }]}>{property?.area || property?.city || 'Unknown'}</Text>
        <View style={[propertyListStyles.propertyInfo, { backgroundColor: dark ? '#2a2a2a' : '#f9f9f9' }]}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>{property?.property_type || 'N/A'}</Text>
          <Text style={[propertyListStyles.rentText, { color: '#27ae60' }]}>₹{property?.lease_amount ? property.lease_amount : (property?.monthly_rent || 'N/A')}{property?.lease_amount ? '' : '/month'}</Text>
        </View>
        <TouchableOpacity
          style={[propertyListStyles.viewMoreButton, { borderTopColor: colors.border }]}
          onPress={() => onViewDetails(property?.id)}
        >
          <Text style={[propertyListStyles.viewMoreText, { color: colors.primary }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove, colors, dark }) => {
  if (!value) return null;
  return (
    <View style={[propertyListStyles.selectedFilterBox, { backgroundColor: dark ? '#1a3a5a' : '#e1f0fa', borderColor: colors.primary }]}>
      <View style={propertyListStyles.selectedFilterContent}>
        <Text style={[propertyListStyles.selectedFilterText, { color: colors.text }]}>
          {label}: {value}
        </Text>
        <TouchableOpacity onPress={onRemove} style={[propertyListStyles.removeFilterButton, { backgroundColor: colors.primary }]}>
          <Text style={propertyListStyles.removeFilterText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PropertiesList() {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentFilter, setRentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
    <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />
      <View style={categoryContentStyles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Text style={[categoryContentStyles.pageTitle, { color: colors.text }]}>Available Business Properties</Text>
          <TouchableOpacity 
            style={[propertyListStyles.searchButton, { backgroundColor: colors.primary, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }]}
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
        
        {/* Filter Section */}
        {isFilterVisible && (
          <View style={propertyListStyles.filterContainer}>
            <View style={[propertyListStyles.filterBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={[propertyListStyles.filterLabel, { color: colors.text }]}>Rent:</Text>
              <Picker
                selectedValue={rentFilter}
                style={[propertyListStyles.picker, { color: colors.text }]}
                dropdownIconColor={colors.text}
                onValueChange={(itemValue) => setRentFilter(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Any" value="" color={colors.placeholder} />
                <Picker.Item label="2000-4000" value="2000-4000" color={colors.text} />
                <Picker.Item label="4000-6000" value="4000-6000" color={colors.text} />
                <Picker.Item label="6000-8000" value="6000-8000" color={colors.text} />
                <Picker.Item label="8000-10000" value="8000-10000" color={colors.text} />
                <Picker.Item label="10000-12000" value="10000-12000" color={colors.text} />
              </Picker>
            </View>
            
            <View style={[propertyListStyles.filterBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={[propertyListStyles.filterLabel, { color: colors.text }]}>Type:</Text>
              <Picker
                selectedValue={typeFilter}
                style={[propertyListStyles.picker, { color: colors.text }]}
                dropdownIconColor={colors.text}
                onValueChange={(itemValue) => setTypeFilter(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Any" value="" color={colors.placeholder} />
                <Picker.Item label="Shop" value="Shop" color={colors.text} />
                <Picker.Item label="Office" value="Office" color={colors.text} />
                <Picker.Item label="Godown" value="Godown" color={colors.text} />
                <Picker.Item label="Industry" value="Industry" color={colors.text} />
              </Picker>
            </View>
            
            <View style={[propertyListStyles.filterBox, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <Text style={[propertyListStyles.filterLabel, { color: colors.text }]}>Area:</Text>
              <Picker
                selectedValue={areaFilter}
                style={[propertyListStyles.picker, { color: colors.text }]}
                dropdownIconColor={colors.text}
                onValueChange={(itemValue) => setAreaFilter(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Any" value="" color={colors.placeholder} />
                <Picker.Item label="Area 1" value="Area 1" color={colors.text} />
                <Picker.Item label="Area 2" value="Area 2" color={colors.text} />
                <Picker.Item label="Area 3" value="Area 3" color={colors.text} />
              </Picker>
            </View>
          </View>
        )}

        {/* Selected Filters Display */}
        <View style={propertyListStyles.selectedFiltersContainer}>
          <SelectedFilterBox 
            label="Rent" 
            value={getRentLabel(rentFilter)} 
            onRemove={() => setRentFilter('')} 
            colors={colors}
            dark={dark}
          />
          <SelectedFilterBox 
            label="Type" 
            value={typeFilter} 
            onRemove={() => setTypeFilter('')} 
            colors={colors}
            dark={dark}
          />
          <SelectedFilterBox 
            label="Area" 
            value={areaFilter} 
            onRemove={() => setAreaFilter('')} 
            colors={colors}
            dark={dark}
          />
        </View>

        {loading ? (
          <Text style={[propertyListStyles.loadingText, { color: colors.subText }]}>Loading properties...</Text>
        ) : properties.length === 0 ? (
          <Text style={[propertyListStyles.noPropertiesText, { color: colors.subText }]}>No properties found</Text>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => (item?.id || Math.random()).toString()}
            renderItem={({ item }) => <PropertyCard property={item} onViewDetails={handleViewDetails} colors={colors} dark={dark} />}
            style={propertyListStyles.list}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}
