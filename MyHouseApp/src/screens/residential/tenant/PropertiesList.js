import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import TenantFilterPanel from '../../../shared/components/TenantFilterPanel';
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getAllProperties, getResidentialAreas } from './api';
import propertyListStyles from './propertyListStyles';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import { getOwnerFormThemeColors } from '../../../styles/ownerFormStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';
import { getTimeAgo } from '../../../shared/utils/timeUtils.js';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

const PropertyCard = ({ property, onViewDetails, tps, dark }) => {
  if (!property) return null;
  const { colors } = tps;
  const firstImageRaw = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
  const firstImage = (typeof firstImageRaw === 'string' && firstImageRaw)
    ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`)
    : 'https://coresg-normal.trae.ai/api/ide/v1/text-to-image?prompt=residential%20house%20or%20apartment%20property%20listing%20placeholder%20image&image_size=square';
  
  return (
    <View style={tps.card}>
      <Image 
        source={{ uri: firstImage }} 
        style={propertyListStyles.imagePlaceholder} 
        resizeMode="cover"
      />
      
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
        <Text style={{ marginLeft: 12, marginBottom: 6, color: colors.subText, fontSize: 12, fontWeight: '500' }}>
          Posted {getTimeAgo(property.createdAt)}
        </Text>
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
  { label: "2k-4k", value: "2000-4000" },
  { label: "4k-6k", value: "4000-6000" },
  { label: "6k-8k", value: "6000-8000" },
  { label: "8k-10k", value: "8000-10000" },
  { label: "10k-12k", value: "10000-12000" },
];

const BEDROOM_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "1 BHK", value: "1" },
  { label: "2 BHK", value: "2" },
  { label: "2+ BHK", value: "3" },
];

// Get label for bedroom filter value
const getBedroomLabel = (value) => {
  switch(value) {
    case '1': return '1 BHK';
    case '2': return '2 BHK';
    case '3': return '2+ BHK';
    default: return '';
  }
};

// Get label for rent filter value
const getRentLabel = (value) => {
  switch(value) {
    case '2000-4000': return '₹2k-4k';
    case '4000-6000': return '₹4k-6k';
    case '6000-8000': return '₹6k-8k';
    case '8000-10000': return '₹8k-10k';
    case '10000-12000': return '₹10k-12k';
    default: return '';
  }
};

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
  const [areaFilterOptions, setAreaFilterOptions] = useState([{ label: "Any", value: "" }]);
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
    loadAreaOptions();
  }, []);

  const collectUniqueAreas = (...sources) => {
    const names = new Set();
    sources.forEach((source) => {
      if (!Array.isArray(source)) return;
      source.forEach((item) => {
        const value = typeof item === 'string' ? item : item?.area;
        if (value != null && String(value).trim()) {
          names.add(String(value).trim());
        }
      });
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  };

  const loadAreaOptions = async () => {
    try {
      const [areasResponse, propertiesResponse] = await Promise.all([
        getResidentialAreas().catch(() => []),
        getAllProperties().catch(() => []),
      ]);

      const uniqueAreas = collectUniqueAreas(
        areasResponse,
        normalizePropertiesResponse(propertiesResponse)
      );
      setAreaFilterOptions([
        { label: "Any", value: "" },
        ...uniqueAreas.map((area) => ({ label: area, value: area })),
      ]);
    } catch (error) {
      console.error('Error loading residential areas:', error);
    }
  };

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

  const listHeader = () => (
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
              type: "searchable",
              label: "Area",
              options: areaFilterOptions,
              value: areaFilter,
              onSelect: setAreaFilter,
              placeholder: "Search area...",
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
      {loading && (
        <Text style={tps.loadingText}>Loading properties...</Text>
      )}
      {!loading && properties.length === 0 && (
        <Text style={propertyListStyles.noPropertiesText}>No properties found</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={tps.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Header />
      <TenantPageHeader
        title="Available Properties"
        subtitle="Browse residential listings in your area"
      />
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => (item?.id || Math.random()).toString()}
        style={propertyListStyles.list}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
      />
      
      <Footer />
    </KeyboardAvoidingView>
  );
}
