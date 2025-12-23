import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import { getAllResidentialOwners } from "./api";

export default function ResidentialOwnerPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOwners, setExpandedOwners] = useState({});

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllResidentialOwners();
      setOwners(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load residential owners. Please try again.');
      console.error('Error loading owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOwnerDetails = (ownerId) => {
    setExpandedOwners(prev => ({
      ...prev,
      [ownerId]: !prev[ownerId]
    }));
  };

  const handleUpdateDetails = (item) => {
    Alert.alert(
      'Update Details',
      `Update details for ${item.ownerName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Update',
          onPress: () => {
            // Placeholder for update functionality
            Alert.alert('Info', 'Update functionality would be implemented here');
          }
        }
      ]
    );
  };

  const renderOwner = ({ item }) => {
    const isExpanded = expandedOwners[item.id];
    
    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Bedrooms: {item.numberOfBedrooms || 'N/A'}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Rent: ₹{item.monthlyRent || 'N/A'}/month</Text>
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
                <Text style={residentialOwnerStyles.detailLabel}>Name:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.ownerName}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Contact:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.contactNo}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Address Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Door No:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.doorNo}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Street:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.street}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Area:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.area}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>City:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.city}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Pincode:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.pincode}</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Property Details</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Facing Direction:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.facingDirection || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Hall Dimensions:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.hallLength || 'N/A'} x {item.hallBreadth || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Kitchen Dimensions:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.kitchenLength || 'N/A'} x {item.kitchenBreadth || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Number of Bathrooms:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.numberOfBathrooms || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Bathroom 1 Type:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.bathroom1Type || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Floor Number:</Text> <Text style={residentialOwnerStyles.detailValue}>{item.floorNumber || 'N/A'}</Text>
              </Text>
            </View>
            
            {/* Location & Nearby Amenities Section (similar to tenant page) */}
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Location & Nearby Amenities</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Street Size:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby Bus Stop:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby School:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby Shopping Mall:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Nearby Bank:</Text> <Text style={residentialOwnerStyles.detailValue}>N/A</Text>
              </Text>
            </View>
            
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Payment Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Advance Amount:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.advanceAmount || 'N/A'}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Monthly Rent:</Text> <Text style={residentialOwnerStyles.detailValue}>₹{item.monthlyRent || 'N/A'}</Text>
              </Text>
            </View>
            
            {/* Update Details Button */}
            <View style={residentialOwnerStyles.updateButtonContainer}>
              <TouchableOpacity 
                style={residentialOwnerStyles.updateButton}
                onPress={() => handleUpdateDetails(item)}
              >
                <Text style={residentialOwnerStyles.updateButtonText}>Update Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={residentialOwnerStyles.container}>
      <View style={residentialOwnerStyles.contentContainer}>
        <Text style={residentialOwnerStyles.title}>Residential Owners</Text>
        
        {loading ? (
          <View style={residentialOwnerStyles.loadingContainer}>
            <Text style={residentialOwnerStyles.loadingText}>Loading residential owners...</Text>
          </View>
        ) : owners.length === 0 ? (
          <View style={residentialOwnerStyles.noDataContainer}>
            <Text style={residentialOwnerStyles.noDataText}>No residential owners found</Text>
          </View>
        ) : (
          <FlatList
            data={owners}
            renderItem={renderOwner}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}