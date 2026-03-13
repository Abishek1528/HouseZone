import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import adminStyles from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import { getAllMachineryOwners } from "./api";

export default function MachineryOwnerPage() {
  const navigation = useNavigation();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOwners, setExpandedOwners] = useState({});

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await getAllMachineryOwners();
      console.log('Loaded machinery owners data:', data);
      setOwners(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load machinery owners. Please try again.");
      console.error("Error loading machinery owners:", error);
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

    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary view */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.ownerName || "Unknown"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Type: {item.type || "N/A"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>Rent: ₹{item.chargePerDay || "N/A"}/day</Text>
          </View>
          <TouchableOpacity 
            style={residentialOwnerStyles.viewMoreButton}
            onPress={() => toggleOwnerDetails(item.machineryId)}
          >
            <Text style={residentialOwnerStyles.viewMoreText}>
              {isExpanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Detailed view (shown when expanded) */}
        {isExpanded && (
          <View style={residentialOwnerStyles.detailedContainer}>
            {/* Images Gallery */}
            {item.images && item.images.length > 0 && (
              <View style={residentialOwnerStyles.detailSection}>
                <Text style={residentialOwnerStyles.sectionTitle}>Images</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {item.images.map((img, idx) => (
                    <Image 
                      key={idx} 
                      source={{ uri: img }} 
                      style={{ width: 100, height: 100, marginRight: 10, borderRadius: 5 }} 
                    />
                  ))}
                </ScrollView>
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


          </View>
        )}
      </View>
    );
  };

  return (
    <View style={residentialOwnerStyles.container}>
      <View style={residentialOwnerStyles.contentContainer}>
        <Text style={residentialOwnerStyles.title}>Machinery Owners</Text>
        
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
            data={owners}
            renderItem={renderOwner}
            keyExtractor={(item) => (item.machineryId ?? Math.random()).toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}