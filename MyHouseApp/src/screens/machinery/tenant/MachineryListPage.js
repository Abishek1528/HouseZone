import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import categoryContentStyles from "../../../styles/categoryContentStyles";
import propertyListStyles from "../../residential/tenant/propertyListStyles";
import machineryListStyles from "./machineryListStyles";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getMachineryProperties } from "./api";

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

export default function MachineryListPage() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentFilter, setRentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Helper to normalize image URLs
  const normalizeImageUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    
    // If it's just a filename, prepend the base upload URL
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
    const baseHost = API_BASE_URL.replace('/api', '');
    return `${baseHost}/uploads/machinery/${url.split('/').pop()}`;
  };

  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getMachineryProperties(filters);
      console.log('Loaded machinery properties:', data);
      setProperties(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load machinery properties. Please try again.");
      console.error("Error loading machinery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
    const unsubscribe = navigation.addListener('focus', () => loadProperties());
    return unsubscribe;
  }, [navigation]);

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {};
    if (rentFilter) filters.rent = rentFilter;
    if (typeFilter) filters.type = typeFilter;
    if (areaFilter) filters.area = areaFilter;

    loadProperties(filters);
  }, [rentFilter, typeFilter, areaFilter]);

  const getRentLabel = (value) => {
    switch (value) {
      case '2000-4000': return '₹2000-4000';
      case '4000-6000': return '₹4000-6000';
      case '6000-8000': return '₹6000-8000';
      case '8000-10000': return '₹8000-10000';
      case '10000-12000': return '₹10000-12000';
      default: return '';
    }
  };

  const handleViewDetails = (machineryId) => {
    navigation.navigate('MachineryDetailsPage', { machineryId });
  };

  const renderProperty = ({ item }) => {
    const firstImage = item.images && item.images.length > 0 ? normalizeImageUrl(item.images[0]) : null;

    return (
      <View style={machineryListStyles.card}>
        {/* Left Side - Image Container */}
        <TouchableOpacity 
          style={machineryListStyles.imageContainer}
          onPress={() => handleViewDetails(item.id)}
        >
          {firstImage ? (
            <Image source={{ uri: firstImage }} style={machineryListStyles.propertyImage} />
          ) : (
            <View style={machineryListStyles.imagePlaceholder}>
              <Text style={machineryListStyles.imageText}>No Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Right Side - Details Container */}
        <View style={machineryListStyles.detailsContainer}>
          <TouchableOpacity onPress={() => handleViewDetails(item.id)}>
            <Text style={machineryListStyles.areaText}>{item.area || "Unknown Area"}</Text>
            
            <View style={machineryListStyles.machineryInfo}>
              <Text style={machineryListStyles.typeText}>{item.machinery_type || "Machinery"}</Text>
              <Text style={machineryListStyles.modelText}>Model: {item.machinery_model || "N/A"}</Text>
              <Text style={machineryListStyles.rentText}>₹{item.charge_per_day || "N/A"}/day</Text>
            </View>
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <TouchableOpacity 
              style={machineryListStyles.viewMoreButton} 
              onPress={() => handleViewDetails(item.id)}
            >
              <Text style={machineryListStyles.viewMoreText}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={categoryContentStyles.pageTitle}>Available Machinery</Text>
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
              <Text style={propertyListStyles.filterLabel}>Type:</Text>
              <Picker
                selectedValue={typeFilter}
                style={propertyListStyles.picker}
                onValueChange={(itemValue) => setTypeFilter(itemValue)}
                mode="dropdown"
              >
                <Picker.Item label="Any" value="" color="#999999" style={{ fontSize: 15 }} />
                <Picker.Item label="Excavator" value="Excavator" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="Crane" value="Crane" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="Bulldozer" value="Bulldozer" color="#000000" style={{ fontSize: 15 }} />
                <Picker.Item label="Loader" value="Loader" color="#000000" style={{ fontSize: 15 }} />
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
          <Text style={machineryListStyles.loadingText}>Loading machinery...</Text>
        ) : properties.length === 0 ? (
          <Text style={machineryListStyles.noPropertiesText}>No machinery found</Text>
        ) : (
          <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
            style={machineryListStyles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Footer />
    </View>
  );
}
