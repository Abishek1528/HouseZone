import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import adminStyles, { ADMIN_COLORS } from "../../styles/admin/adminStyles";
import AdminPageHeader from "../../shared/components/AdminPageHeader";
import AdminTenantSubmissionCard from "../../shared/components/AdminTenantSubmissionCard";
import { getMachineryTenantsWithItems } from "./api";

export default function MachineryTenantPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMachineryTenantsWithItems();
      setData(result || []);
    } catch (error) {
      console.error("Error fetching machinery tenant data:", error);
      Alert.alert("Error", "Failed to fetch machinery tenant and item details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader
        title="Machinery Tenants"
        subtitle="Review tenant submissions and open the linked machinery listing"
      />
      <ScrollView style={adminStyles.body} contentContainerStyle={adminStyles.scrollContent}>
        {loading ? (
          <View style={adminStyles.loadingWrap}>
            <ActivityIndicator size="large" color={ADMIN_COLORS.primary} />
          </View>
        ) : !Array.isArray(data) || data.length === 0 ? (
          <Text style={adminStyles.noDataText}>No machinery tenant submissions found</Text>
        ) : (
          data.map((item) => (
            <AdminTenantSubmissionCard
              key={item?.tenantId ?? Math.random()}
              item={item}
              ownerCategory="machinery"
              propertySectionTitle="Machinery Details"
              propertyFields={[
                { label: "Machinery ID:", value: item?.propertyId },
                { label: "Name:", value: item?.itemName },
                { label: "Model:", value: item?.model },
                { label: "Type:", value: item?.itemType },
                { label: "Daily Rent:", value: item?.rent != null ? `₹${item.rent}` : "N/A" },
              ]}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
