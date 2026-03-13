import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import categoryContentStyles from "../../../styles/categoryContentStyles";
import machineryListStyles from "./machineryListStyles";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getMachineryProperties } from "./api";

export default function MachineryListPage() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());

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

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getMachineryProperties();
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

  const handleViewDetails = (machineryId) => {
    navigation.navigate('MachineryDetailsPage', { machineryId });
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderProperty = ({ item }) => {
    const isExpanded = expandedIds.has(item.id);
    const firstImage = item.images && item.images.length > 0 ? normalizeImageUrl(item.images[0]) : null;

    return (
      <View style={machineryListStyles.card}>
        {/* Left Side - Image Container */}
        <TouchableOpacity 
          style={machineryListStyles.imageContainer}
          onPress={() => toggleExpand(item.id)}
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
          <TouchableOpacity onPress={() => toggleExpand(item.id)}>
            <Text style={machineryListStyles.areaText}>{item.area || "Unknown Area"}</Text>
            
            <View style={machineryListStyles.machineryInfo}>
              <Text style={machineryListStyles.typeText}>{item.machinery_type || "Machinery"}</Text>
              <Text style={machineryListStyles.modelText}>Model: {item.machinery_model || "N/A"}</Text>
              <Text style={machineryListStyles.rentText}>₹{item.charge_per_day || "N/A"}/day</Text>
            </View>
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity 
              style={machineryListStyles.viewMoreButton} 
              onPress={() => handleViewDetails(item.id)}
            >
              <Text style={machineryListStyles.viewMoreText}>
                View More
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={[machineryListStyles.viewMoreText, { color: '#666' }]}>
                {isExpanded ? 'Show Less' : 'Details'}
              </Text>
            </TouchableOpacity>
          </View>

          {isExpanded && (
            <View style={machineryListStyles.expandedDetails}>
              <View style={machineryListStyles.detailSection}>
                <Text style={machineryListStyles.detailHeader}>Specifications</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Name:</Text> {item.machinery_name || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Model:</Text> {item.machinery_model || 'N/A'}</Text>
              </View>
              
              <View style={machineryListStyles.detailSection}>
                <Text style={machineryListStyles.detailHeader}>Pricing Details</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Per Km:</Text> ₹{item.charge_per_km || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Wait/Hour:</Text> ₹{item.waiting_charge_per_hour || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Wait/Night:</Text> ₹{item.waiting_charge_per_night || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Fixed Rate:</Text> {item.is_fixed ? 'Yes' : 'No'}</Text>
              </View>

              {item.images && item.images.length > 1 && (
                <View style={machineryListStyles.detailSection}>
                  <Text style={machineryListStyles.detailHeader}>More Images</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {item.images.slice(1).map((uri, idx) => {
                      const normalizedUri = normalizeImageUrl(uri);
                      if (!normalizedUri) return null;
                      return (
                        <Image 
                          key={idx} 
                          source={{ uri: normalizedUri }} 
                          style={{ width: 100, height: 100, marginRight: 10, borderRadius: 5 }} 
                        />
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Available Machinery</Text>
        
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
