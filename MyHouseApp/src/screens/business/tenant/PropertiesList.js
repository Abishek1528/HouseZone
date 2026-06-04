import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from "react-native";
import TenantFilterPanel from '../../../shared/components/TenantFilterPanel';
import { useNavigation } from "@react-navigation/native";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import categoryContentStyles from '../../../styles/categoryContentStyles';
import propertyListStyles from '../../residential/tenant/propertyListStyles';
import { getAllProperties } from './api';
import { getTenantPageStyles } from '../../../styles/tenantPageStyles';
import { getOwnerFormThemeColors } from '../../../styles/ownerFormStyles';
import TenantPageHeader from '../../../shared/components/TenantPageHeader';
import { useTheme } from '../../../context/ThemeContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

const PropertyCard = ({ property, onViewDetails, tps, dark }) => {
  const { colors } = tps;
  if (!property) return null;
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
          <Text style={[propertyListStyles.imageText, { color: colors.subText }]}>Image</Text>
        </View>
      )}
      <View style={propertyListStyles.detailsContainer}>
        <View style={tps.propertyInfo}>
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
    if (typeFilter) filters.propertyType = typeFilter;
    if (areaFilter) filters.area = areaFilter;
    
    loadProperties(filters);
  }, [typeFilter, areaFilter]);

  const handleViewDetails = (id) => {
    navigation.navigate('BusinessPropertyDetails', { propertyId: id });
  };

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Business Properties"
        subtitle="Browse commercial spaces available to rent"
      />
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
              { key: "area", label: "Area", options: AREA_FILTER_OPTIONS, value: areaFilter, onSelect: setAreaFilter },
            ]}
          />
        )}

        {/* Selected Filters Display */}
        <View style={propertyListStyles.selectedFiltersContainer}>
          <SelectedFilterBox label="Type" value={typeFilter} onRemove={() => setTypeFilter('')} tps={tps} />
          <SelectedFilterBox label="Area" value={areaFilter} onRemove={() => setAreaFilter('')} tps={tps} />
        </View>

        {loading ? (
          <Text style={tps.loadingText}>Loading properties...</Text>
        ) : properties.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No properties found</Text>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => (item?.id || Math.random()).toString()}
            renderItem={({ item }) => <PropertyCard property={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />}
            style={propertyListStyles.list}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}
