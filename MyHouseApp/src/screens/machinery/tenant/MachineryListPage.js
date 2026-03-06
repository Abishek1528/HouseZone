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

  const renderProperty = ({ item }) => {
    const isExpanded = expandedIds.has(item.id);
    const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;

    return (
      <View style={machineryListStyles.card}>
        {/* Left Side - Image Container */}
        <View style={machineryListStyles.imageContainer}>
          {firstImage ? (
            <Image source={{ uri: firstImage }} style={machineryListStyles.propertyImage} />
          ) : (
            <View style={machineryListStyles.imagePlaceholder}>
              <Text style={machineryListStyles.imageText}>No Image</Text>
            </View>
          )}
        </View>

        {/* Right Side - Details Container */}
        <View style={machineryListStyles.detailsContainer}>
          <Text style={machineryListStyles.areaText}>{item.area || "Unknown Area"}</Text>
          
          <View style={machineryListStyles.machineryInfo}>
            <Text style={machineryListStyles.typeText}>{item.type || "Machinery"}</Text>
            <Text style={machineryListStyles.modelText}>Model: {item.model || "N/A"}</Text>
            <Text style={machineryListStyles.rentText}>₹{item.chargePerDay || "N/A"}/day</Text>
          </View>
          
          <TouchableOpacity 
            style={machineryListStyles.viewMoreButton} 
            onPress={() => handleViewDetails(item.id)}
          >
            <Text style={machineryListStyles.viewMoreText}>
              View More
            </Text>
          </TouchableOpacity>

          {isExpanded && (
            <View style={machineryListStyles.expandedDetails}>
              <View style={machineryListStyles.detailSection}>
                <Text style={machineryListStyles.detailHeader}>Specifications</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Name:</Text> {item.name || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Model:</Text> {item.model || 'N/A'}</Text>
              </View>
              
              <View style={machineryListStyles.detailSection}>
                <Text style={machineryListStyles.detailHeader}>Pricing Details</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Per Km:</Text> ₹{item.chargePerKm || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Wait/Hour:</Text> ₹{item.waitingChargePerHour || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Wait/Night:</Text> ₹{item.waitingChargePerNight || 'N/A'}</Text>
                <Text style={machineryListStyles.detailText}><Text style={machineryListStyles.detailLabel}>Fixed Rate:</Text> {item.isFixed ? 'Yes' : 'No'}</Text>
              </View>

              {item.images && item.images.length > 1 && (
                <View style={machineryListStyles.detailSection}>
                  <Text style={machineryListStyles.detailHeader}>More Images</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {item.images.slice(1).map((uri, idx) => (
                      <Image 
                        key={idx} 
                        source={{ uri }} 
                        style={{ width: 100, height: 100, marginRight: 10, borderRadius: 5 }} 
                      />
                    ))}
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
