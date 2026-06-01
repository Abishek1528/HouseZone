import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from "react-native";
import TenantFilterPanel from '../../../shared/components/TenantFilterPanel';
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getAllProperties } from './api';
import propertyListStyles from './propertyListStyles';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import { getOwnerFormThemeColors } from '../../../styles/ownerFormStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

const PropertyCard = ({ property, onViewDetails, tps, dark }) => {
  if (!property) return null;
  const { colors } = tps;
  const firstImageRaw = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
  const firstImage = (typeof firstImageRaw === 'string' && firstImageRaw)
    ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`)
    : null;
  
  return (
    <View style={tps.card}>
      {firstImage ? (
        <Image source={{ uri: firstImage }} style={propertyListStyles.imagePlaceholder} />
      ) : (
        <View style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0' }]}>
          <Text style={[propertyListStyles.imageText, { color: colors.subText }]}>Property Image</Text>
        </View>
      )}
      
      {/* Right side - Property details */}
      <View style={propertyListStyles.detailsContainer}>
        <Text style={[propertyListStyles.location, { color: colors.text }]}>{property?.area || 'Unknown'}</Text>
        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>{property?.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}</Text>
          {/* Display lease amount if available, otherwise show monthly rent */}
          <Text style={[propertyListStyles.rentText, { color: '#27ae60', borderTopColor: colors.border }]}>
            ₹{property?.leaseAmount ? property.leaseAmount : (property?.rent || 'N/A')}{property?.leaseAmount ? '' : '/month'}
          </Text>
        </View>
        <Text style={[propertyListStyles.viewMoreText, { color: colors.primary }]} onPress={() => onViewDetails(property?.id)}>View More</Text>
      </View>
    </View>
  );
};

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove, tps }) => {
  const { colors } = tps;
  // Don't show if no value is selected
  if (!value) return null;
  
  return (
    <View style={propertyListStyles.selectedFilterBox}>
      <View style={propertyListStyles.selectedFilterContent}>
        <Text style={[propertyListStyles.selectedFilterText, { color: colors.text }]}>
          {label}: {value}
        </Text>
        <TouchableOpacity onPress={onRemove} style={propertyListStyles.removeFilterButton}>
          <Text style={propertyListStyles.removeFilterText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RENT_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "2000-4000", value: "2000-4000" },
  { label: "4000-6000", value: "4000-6000" },
  { label: "6000-8000", value: "6000-8000" },
  { label: "8000-10000", value: "8000-10000" },
  { label: "10000-12000", value: "10000-12000" },
];

const BEDROOM_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "3 BHK", value: "3" },
  { label: "3+ BHK", value: "4" },
];

const AREA_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Area 1", value: "Area 1" },
  { label: "Area 2", value: "Area 2" },
  { label: "Area 3", value: "Area 3" },
];

export default function PropertiesList() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentFilter, setRentFilter] = useState('');
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const normalizePropertiesResponse = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.properties)) return payload.properties;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.rows)) return payload.rows;

    if (payload != null) {
      console.error("Unexpected properties response shape", {
        receivedType: typeof payload,
        payload,
      });
    }
    return [];
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('Fetching properties...');
      const data = await getAllProperties(filters);
      console.log('Properties fetched:', data);
      const normalizedProperties = normalizePropertiesResponse(data);
      setProperties(normalizedProperties);
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
      if (!propertyId) {
        console.error("Invalid property id while navigating to details", { propertyId });
        Alert.alert('Error', 'Invalid property selected. Please refresh and try again.');
        return;
      }
      console.log('Navigating to PropertyDetails with ID:', propertyId);
      navigation.navigate('PropertyDetails', { propertyId });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to navigate to property details.');
    }
  };

  const renderProperty = ({ item }) => {
    if (!item) return null;
    return <PropertyCard property={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />;
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
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Available Properties"
        subtitle="Browse residential listings in your area"
      />
      <View style={propertyListStyles.content}>
        <View style={propertyListStyles.titleRow}>
          <Text style={tps.pageTitle}>Listings</Text>
          <TouchableOpacity
            style={tps.filterBtn}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Text style={tps.filterBtnText}>
              {isFilterVisible ? "Hide Filter" : "Filter"}{" "}
              {isFilterVisible ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isFilterVisible && (
          <TenantFilterPanel
            colors={themeColors}
            sections={[
              {
                key: "rent",
                label: "Rent",
                options: RENT_FILTER_OPTIONS,
                value: rentFilter,
                onSelect: setRentFilter,
              },
              {
                key: "bedrooms",
                label: "Bedrooms",
                options: BEDROOM_FILTER_OPTIONS,
                value: bedroomFilter,
                onSelect: setBedroomFilter,
              },
              {
                key: "area",
                label: "Area",
                options: AREA_FILTER_OPTIONS,
                value: areaFilter,
                onSelect: setAreaFilter,
              },
            ]}
          />
        )}
        
        {/* Display selected filters horizontally with remove option */}
        <View style={propertyListStyles.selectedFiltersContainer}>
          <SelectedFilterBox
            label="Rent"
            value={getRentLabel(rentFilter)}
            onRemove={() => setRentFilter("")}
            tps={tps}
          />
          <SelectedFilterBox
            label="Bedrooms"
            value={getBedroomLabel(bedroomFilter)}
            onRemove={() => setBedroomFilter("")}
            tps={tps}
          />
          <SelectedFilterBox
            label="Area"
            value={areaFilter}
            onRemove={() => setAreaFilter("")}
            tps={tps}
          />
        </View>
        
        {/* Properties List */}
        {loading ? (
          <Text style={tps.loadingText}>Loading properties...</Text>
        ) : properties.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No properties found</Text>
        ) : (
          <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={(item) => (item?.id || Math.random()).toString()}
            style={propertyListStyles.list}
          />
        )}
      </View>
      
      <Footer />
    </View>
  );
}
