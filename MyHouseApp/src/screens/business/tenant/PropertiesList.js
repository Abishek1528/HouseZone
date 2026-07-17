import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import TenantFilterPanel from '../../../shared/components/TenantFilterPanel';
import { useNavigation } from "@react-navigation/native";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAllProperties, getBusinessAreas } from './api';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import { getOwnerFormThemeColors } from '../../../styles/ownerFormStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';
import { getTimeAgo } from '../../../shared/utils/timeUtils.js';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

const PropertyCard = ({ property, onViewDetails, tps, dark }) => {
  const { colors } = tps;
  if (!property) return null;
  const firstImageRaw = Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : null;
  const firstImage = (typeof firstImageRaw === 'string' && firstImageRaw)
    ? (firstImageRaw.startsWith('http') ? firstImageRaw : `${API_HOST}${firstImageRaw}`)
    : 'https://coresg-normal.trae.ai/api/ide/v1/text-to-image?prompt=commercial%20real%20estate%20office%20space%20placeholder%20image&image_size=square';
  
  const displayPropertyType = property.propertyType || property.property_type || 'N/A';
  const displayRent = property.leaseAmount || property.lease_amount || property.monthlyRent || property.monthly_rent || 'N/A';
  const rentLabel = (property.leaseAmount || property.lease_amount) ? '' : '/month';
  
  return (
    <View style={tps.card}>
      <Image 
        source={{ uri: firstImage }} 
        style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0' }]} 
        resizeMode="cover"
      />
      <View style={propertyListStyles.detailsContainer}>
        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>{displayPropertyType}</Text>
          <Text style={[propertyListStyles.rentText, { color: '#27ae60' }]}>
            ₹{displayRent}{rentLabel}
          </Text>
        </View>
        <Text style={{ marginLeft: 12, marginBottom: 8, color: colors.subText, fontSize: 12, fontWeight: '500' }}>
          Posted {getTimeAgo(property.createdAt)}
        </Text>
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
const SelectedFilterBox = ({ label, value, onRemove, tps }) => {
  const { colors } = tps;
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

const TYPE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Shop", value: "shop" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Office", value: "office" },
  { label: "Showroom", value: "showroom" },
];

export default function PropertiesList() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [areaFilterOptions, setAreaFilterOptions] = useState([{ label: "Any", value: "" }]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

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
        getBusinessAreas().catch(() => []),
        getAllProperties().catch(() => []),
      ]);

      const uniqueAreas = collectUniqueAreas(areasResponse, propertiesResponse);
      setAreaFilterOptions([
        { label: "Any", value: "" },
        ...uniqueAreas.map((area) => ({ label: area, value: area })),
      ]);
    } catch (error) {
      console.error('Error loading business areas:', error);
    }
  };

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
    if (typeFilter) filters.propertyType = typeFilter;
    if (areaFilter) filters.area = areaFilter;
    
    loadProperties(filters);
  }, [typeFilter, areaFilter]);

  const handleViewDetails = (id) => {
    console.log('View Details clicked for property with id:', id);
    navigation.navigate('BusinessPropertyDetails', { propertyId: id });
  };

  const listHeader = () => (
    <View style={propertyListStyles.content}>
      <View style={propertyListStyles.titleRow}>
        <Text style={tps.pageTitle}>Listings</Text>
        <TouchableOpacity style={tps.filterBtn} onPress={() => setIsFilterVisible(!isFilterVisible)}>
          <Text style={tps.filterBtnText}>
            {isFilterVisible ? "Hide Filter" : "Filter"} {isFilterVisible ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isFilterVisible && (
        <TenantFilterPanel
          colors={themeColors}
          sections={[
            { key: "type", label: "Type", options: TYPE_FILTER_OPTIONS, value: typeFilter, onSelect: setTypeFilter },
            { key: "area", type: "searchable", label: "Area", options: areaFilterOptions, value: areaFilter, onSelect: setAreaFilter, placeholder: "Search area..." },
          ]}
        />
      )}

      {/* Selected Filters Display */}
      <View style={propertyListStyles.selectedFiltersContainer}>
        <SelectedFilterBox label="Type" value={typeFilter} onRemove={() => setTypeFilter('')} tps={tps} />
        <SelectedFilterBox label="Area" value={areaFilter} onRemove={() => setAreaFilter('')} tps={tps} />
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
        title="Business Properties"
        subtitle="Browse commercial spaces available to rent"
      />
      <FlatList
        data={properties}
        keyExtractor={(item) => (item?.id || Math.random()).toString()}
        renderItem={({ item }) => <PropertyCard property={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />}
        style={propertyListStyles.list}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
      />
      <Footer />
    </KeyboardAvoidingView>
  );
}
