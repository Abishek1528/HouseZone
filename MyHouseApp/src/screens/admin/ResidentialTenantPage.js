import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";
import { getResidentialTenantsWithProperties } from "./api";
 

export default function ResidentialTenantPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getResidentialTenantsWithProperties();
      setData(result);
    } catch (error) {
      console.error("Error fetching admin tenant data:", error);
      Alert.alert("Error", "Failed to fetch tenant and house details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={adminStyles.dashboardContainer}>
      <ScrollView contentContainerStyle={adminStyles.dashboardContentContainer} style={{ width: '100%' }}>
        <Text style={adminStyles.dashboardTitle}>Residential Tenant Submissions</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
        ) : data.length === 0 ? (
          <Text style={adminStyles.noDataText}>No tenant submissions found</Text>
        ) : (
          data.map((item) => (
            <View key={item.tenantId} style={adminStyles.card}>
              <View style={adminStyles.cardHeader}>
                <Text style={adminStyles.cardTitle}>Tenant: {item.tenantName}</Text>
                <Text style={adminStyles.cardSubtitle}>ID: {item.tenantId}</Text>
              </View>
              
              <View style={adminStyles.cardSection}>
                <Text style={adminStyles.sectionTitle}>👤 Tenant Details</Text>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Job:</Text>
                  <Text style={adminStyles.detailValue}>{item.job || 'N/A'}</Text>
                </View>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Salary:</Text>
                  <Text style={adminStyles.detailValue}>₹{item.salary || 'N/A'}</Text>
                </View>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Native:</Text>
                  <Text style={adminStyles.detailValue}>{item.nativePlace || 'N/A'}</Text>
                </View>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Contact:</Text>
                  <Text style={adminStyles.detailValue}>{item.mobileNumber}</Text>
                </View>
              </View>

              <View style={adminStyles.cardSection}>
                <Text style={adminStyles.sectionTitle}>🏠 House Details</Text>
                {item.propertyId ? (
                  <>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Property ID:</Text>
                      <Text style={adminStyles.detailValue}>{item.propertyId}</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Address:</Text>
                      <Text style={adminStyles.detailValue}>{item.doorNo}, {item.street}, {item.area}, {item.city}</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Bedrooms:</Text>
                      <Text style={adminStyles.detailValue}>{item.bedrooms} BHK</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Rent:</Text>
                      <Text style={adminStyles.detailValue}>₹{item.rent || 'N/A'}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={adminStyles.noPropertyText}>No property associated</Text>
                )}
              </View>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
