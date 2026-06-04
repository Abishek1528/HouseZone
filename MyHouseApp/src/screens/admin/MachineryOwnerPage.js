import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import AdminImageGallery from "../../shared/components/AdminImageGallery";
import { useNavigation, useRoute } from '@react-navigation/native';
import AdminPageHeader from "../../shared/components/AdminPageHeader";
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import {
  useAdminFocusProperty,
  isAdminPropertyHighlighted,
  MACHINERY_PROPERTY_ALT_KEYS,
  adminListScrollToIndexFailed,
} from "../../shared/admin/useAdminFocusProperty";
import { getAllMachineryOwners } from "./api";

export default function MachineryOwnerPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOwners, setExpandedOwners] = useState({});
  const listRef = useRef(null);

  useAdminFocusProperty(owners, setExpandedOwners, "machineryId", MACHINERY_PROPERTY_ALT_KEYS, listRef);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllMachineryOwners();
      console.log('Loaded machinery owners data:', data);
      if (Array.isArray(data)) {
        setOwners(data);
      } else {
        console.warn('API returned non-array data:', data);
        setOwners([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load machinery owners. Please try again.");
      console.error("Error loading machinery owners:", error);
      setOwners([]);
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

  const toggleOwnerDetails = (machineryId) => {
    setExpandedOwners(prev => ({
      ...prev,
      [machineryId]: !prev[machineryId]
    }));
  };

  const renderOwner = ({ item }) => {
    const isExpanded = expandedOwners[item.machineryId];
    const highlighted = isAdminPropertyHighlighted(route, item, "machineryId", MACHINERY_PROPERTY_ALT_KEYS);

    return (
      <View style={[residentialOwnerStyles.ownerCard, highlighted && adminStyles.highlightCard]}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName || "Unknown"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Type: {item.type || "N/A"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Rent: ₹{item.chargePerDay || "N/A"}/day</Text>
          </View>
          {!isExpanded ? (
            <TouchableOpacity
              style={residentialOwnerStyles.viewMoreButton}
              onPress={() => toggleOwnerDetails(item.machineryId)}
            >
              <Text style={residentialOwnerStyles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        
        {/* Detailed view (shown when expanded) */}
        {isExpanded && (
          <View style={residentialOwnerStyles.detailedContainer}>
            {/* Images Gallery */}
            {Array.isArray(item.images) && item.images.filter(img => typeof img === 'string' && img.trim() !== '').length > 0 && (
              <View style={residentialOwnerStyles.detailSection}>
                <Text style={residentialOwnerStyles.sectionTitle}>Images</Text>
                <AdminImageGallery images={item.images} thumbnailWidth={100} thumbnailHeight={100} />
              </View>
            )}

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
              <Text style={residentialOwnerStyles.sectionTitle}>Machinery Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Machinery ID:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.machineryId}</Text>
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
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Pricing Details</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Charge per Day:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.chargePerDay || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Charge per KM:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.chargePerKm || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Wait per Hour:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.waitingChargePerHour || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Wait per Night:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.waitingChargePerNight || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Fixed Rate:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.isFixed ? "Yes" : "No"}</Text>
              </Text>
            </View>

            <View style={residentialOwnerStyles.collapseButtonRow}>
              <TouchableOpacity
                style={residentialOwnerStyles.collapseButton}
                onPress={() => toggleOwnerDetails(item.machineryId)}
              >
                <Text style={residentialOwnerStyles.collapseButtonText}>View Less</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={residentialOwnerStyles.container}>
      <AdminPageHeader
        title="Machinery Owners"
        subtitle={route.params?.propertyId ? "Showing machinery from tenant submission" : "Manage machinery owner listings"}
      />
      <View style={residentialOwnerStyles.contentContainer}>
        
        {loading ? (
          <View style={residentialOwnerStyles.loadingContainer}>
            <Text style={residentialOwnerStyles.loadingText}>Loading machinery owners...</Text>
          </View>
        ) : owners.length === 0 ? (
          <View style={residentialOwnerStyles.noDataContainer}>
            <Text style={residentialOwnerStyles.noDataText}>No machinery owners found</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={owners}
            renderItem={renderOwner}
            keyExtractor={(item, index) => item?.machineryId?.toString() || index.toString()}
            showsVerticalScrollIndicator={false}
            onScrollToIndexFailed={adminListScrollToIndexFailed(listRef)}
          />
        )}
      </View>
    </View>
  );
}