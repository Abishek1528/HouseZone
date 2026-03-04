import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import { getAllVehiclesOwners } from "./api";

export default function VehiclesOwnerPage() {
  const navigation = useNavigation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVehicles, setExpandedVehicles] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllVehiclesOwners();
      console.log('Loaded vehicles owners data:', data);
      setRows(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load vehicles owners. Please try again.");
      console.error("Error loading vehicles owners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const toggleVehicleDetails = (vehicleId) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vehicleId]: !prev[vehicleId]
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedVehicles[item.vehicleId];
    const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
    
    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName || "Unknown"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>{item.name} ({item.type})</Text>
            <Text style={residentialOwnerStyles.summaryText}>AC: ₹{item.acChargePerDay || "N/A"}/day</Text>
          </View>
          <TouchableOpacity 
            style={residentialOwnerStyles.viewMoreButton}
            onPress={() => toggleVehicleDetails(item.vehicleId)}
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
              <Text style={residentialOwnerStyles.sectionTitle}>Owner Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>ID:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.ownerId}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Name:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.ownerName || "Unknown"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Contact:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.contactNo || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Address:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.doorNo ? `${item.doorNo}, ` : ''}{item.street || ''}, {item.area || ''}, {item.city || ''} - {item.pincode || ''}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Vehicle Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Vehicle ID:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.vehicleId}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.type || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Name:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.name || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Model:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.model || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Fuel Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.fuelType || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Seat Capacity:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.seatCapacity || "N/A"}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>AC Pricing</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Charge per Day:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.acChargePerDay || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Charge per KM:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.acChargePerKm || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Wait per Hour:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.acWaitPerHour || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Wait per Night:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.acWaitPerNight || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Fixed:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.acFixed ? "Yes" : "No"}</Text>
              </Text>
            </View>

            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Non-AC Pricing</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Charge per Day:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.nonAcChargePerDay || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Charge per KM:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.nonAcChargePerKm || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Wait per Hour:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.nonAcWaitPerHour || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Wait per Night:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.nonAcWaitPerNight || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Fixed:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.nonAcFixed ? "Yes" : "No"}</Text>
              </Text>
            </View>

            {firstImage && (
              <View style={residentialOwnerStyles.detailSection}>
                <Text style={residentialOwnerStyles.sectionTitle}>Vehicle Image</Text>
                <Image source={{ uri: firstImage }} style={{ width: "100%", height: 200, borderRadius: 10 }} resizeMode="cover" />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={residentialOwnerStyles.container}>
      <View style={residentialOwnerStyles.contentContainer}>
        <Text style={residentialOwnerStyles.title}>Vehicles Owners</Text>
        
        {loading ? (
          <View style={residentialOwnerStyles.loadingContainer}>
            <Text style={residentialOwnerStyles.loadingText}>Loading vehicles...</Text>
          </View>
        ) : rows.length === 0 ? (
          <View style={residentialOwnerStyles.noDataContainer}>
            <Text style={residentialOwnerStyles.noDataText}>No vehicles found</Text>
          </View>
        ) : (
          <FlatList
            data={rows}
            renderItem={renderItem}
            keyExtractor={(item) => (item.vehicleId ?? Math.random()).toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
