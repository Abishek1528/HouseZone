import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import { getAllBusinessOwners } from "./api";

export default function BusinessOwnerPage() {
  const navigation = useNavigation();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOwners, setExpandedOwners] = useState({});

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllBusinessOwners();
      console.log('Loaded business owners data:', data);
      setOwners(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load business owners. Please try again.");
      console.error("Error loading business owners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadOwners();
    });
    
    return unsubscribe;
  }, [navigation]);

  const toggleOwnerDetails = (ownerId) => {
    setExpandedOwners(prev => ({
      ...prev,
      [ownerId]: !prev[ownerId]
    }));
  };

  const renderOwner = ({ item }) => {
    const isExpanded = expandedOwners[item.id];
    const amount = item.leaseAmount ? `Lease: ₹${item.leaseAmount}` : `Rent: ₹${item.monthlyRent || 'N/A'}/month`;
    
    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName || "Unknown"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Type: {item.propertyType || "N/A"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>{amount}</Text>
          </View>
          <TouchableOpacity 
            style={residentialOwnerStyles.viewMoreButton}
            onPress={() => toggleOwnerDetails(item.id)}
          >
            <Text style={residentialOwnerStyles.viewMoreText}>
              {isExpanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Detailed view (shown when expanded) */}
        {isExpanded && (
          <View style={residentialOwnerStyles.detailedContainer}>
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Personal Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>ID:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.id}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Name:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.ownerName || "Unknown"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Contact:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.contactNo || "N/A"}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Address Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Area:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.area || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>City:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.city || "N/A"}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Property Details</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Property Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.propertyType || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Door Facing:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.doorFacing || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Dimensions:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.areaLength || "N/A"} x {item.areaBreadth || "N/A"} ft</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Restroom:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.restroomAvailable !== undefined ? String(item.restroomAvailable) : "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Floor Number:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.floorNumber || "N/A"}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Payment Information</Text>
              {item.leaseAmount ? (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Lease Amount:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.leaseAmount}</Text>
                </Text>
              ) : (
                <>
                  <Text style={residentialOwnerStyles.detailText}>
                    <Text style={residentialOwnerStyles.detailLabel}>Advance Amount:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.advanceAmount || 'N/A'}</Text>
                  </Text>
                  <Text style={residentialOwnerStyles.detailText}>
                    <Text style={residentialOwnerStyles.detailLabel}>Monthly Rent:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.monthlyRent || 'N/A'}</Text>
                  </Text>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={residentialOwnerStyles.container}>
      <View style={residentialOwnerStyles.contentContainer}>
        <Text style={residentialOwnerStyles.title}>Business Owners</Text>
        
        {loading ? (
          <View style={residentialOwnerStyles.loadingContainer}>
            <Text style={residentialOwnerStyles.loadingText}>Loading business owners...</Text>
          </View>
        ) : owners.length === 0 ? (
          <View style={residentialOwnerStyles.noDataContainer}>
            <Text style={residentialOwnerStyles.noDataText}>No business owners found</Text>
          </View>
        ) : (
          <FlatList
            data={owners}
            renderItem={renderOwner}
            keyExtractor={(item) => (item.id ?? Math.random()).toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
