import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";
import { getBusinessTenantsWithProperties } from "./api";
 

export default function BusinessTenantPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getBusinessTenantsWithProperties();
      setData(result);
    } catch (error) {
      console.error("Error fetching business tenant data:", error);
      Alert.alert("Error", "Failed to fetch business tenant and property details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={adminStyles.dashboardContainer}>
      <ScrollView contentContainerStyle={adminStyles.dashboardContentContainer} style={{ width: '100%' }}>
        <Text style={adminStyles.dashboardTitle}>Business Tenant Submissions</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
        ) : (!Array.isArray(data) || data.length === 0) ? (
          <Text style={adminStyles.noDataText}>No business tenant submissions found</Text>
        ) : (
          data.map((item) => (
            <View key={item?.tenantId || Math.random()} style={adminStyles.card}>
              <View style={adminStyles.cardHeader}>
                <Text style={adminStyles.cardTitle}>Tenant: {item?.tenantName || 'N/A'}</Text>
                <Text style={adminStyles.cardSubtitle}>ID: {item?.tenantId || 'N/A'}</Text>
              </View>
              
              <View style={adminStyles.cardSection}>
                <Text style={adminStyles.sectionTitle}>👤 Tenant Details</Text>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Job:</Text>
                  <Text style={adminStyles.detailValue}>{item?.job || 'N/A'}</Text>
                </View>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Salary:</Text>
                  <Text style={adminStyles.detailValue}>₹{item?.salary || 'N/A'}</Text>
                </View>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Native:</Text>
                  <Text style={adminStyles.detailValue}>{item?.nativePlace || 'N/A'}</Text>
                </View>
                <View style={adminStyles.detailRow}>
                  <Text style={adminStyles.detailLabel}>Contact:</Text>
                  <Text style={adminStyles.detailValue}>{item?.mobileNumber || 'N/A'}</Text>
                </View>
              </View>

              <View style={adminStyles.cardSection}>
                <Text style={adminStyles.sectionTitle}>🏢 Business Property Details</Text>
                {item?.propertyId ? (
                  <>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Property ID:</Text>
                      <Text style={adminStyles.detailValue}>{item.propertyId}</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Type:</Text>
                      <Text style={adminStyles.detailValue}>{item.propertyType || 'N/A'}</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Address:</Text>
                      <Text style={adminStyles.detailValue}>{item.doorNo}, {item.street}, {item.area}, {item.city}</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Facing:</Text>
                      <Text style={adminStyles.detailValue}>{item.facingDirection || 'N/A'}</Text>
                    </View>
                    <View style={adminStyles.detailRow}>
                      <Text style={adminStyles.detailLabel}>Rent:</Text>
                      <Text style={adminStyles.detailValue}>₹{item.rent || 'N/A'}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={adminStyles.noPropertyText}>No business property associated</Text>
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
