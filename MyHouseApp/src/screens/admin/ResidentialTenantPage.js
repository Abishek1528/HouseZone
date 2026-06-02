import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import adminStyles, { ADMIN_COLORS } from "../../styles/admin/adminStyles";
import AdminPageHeader from "../../shared/components/AdminPageHeader";
import AdminTenantSubmissionCard from "../../shared/components/AdminTenantSubmissionCard";
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
      setData(result || []);
    } catch (error) {
      console.error("Error fetching admin tenant data:", error);
      Alert.alert("Error", "Failed to fetch tenant and house details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader
        title="Residential Tenants"
        subtitle="Review tenant submissions and open the linked property"
      />
      <ScrollView style={adminStyles.body} contentContainerStyle={adminStyles.scrollContent}>
        {loading ? (
          <View style={adminStyles.loadingWrap}>
            <ActivityIndicator size="large" color={ADMIN_COLORS.primary} />
          </View>
        ) : !Array.isArray(data) || data.length === 0 ? (
          <Text style={adminStyles.noDataText}>No tenant submissions found</Text>
        ) : (
          data.map((item) => (
            <AdminTenantSubmissionCard
              key={item?.tenantId ?? Math.random()}
              item={item}
              ownerCategory="residential"
              propertySectionTitle="House Details"
              propertyFields={[
                { label: "Property ID:", value: item?.propertyId },
                {
                  label: "Address:",
                  value: [item?.doorNo, item?.street, item?.area, item?.city].filter(Boolean).join(", ") || "N/A",
                },
                { label: "Bedrooms:", value: item?.bedrooms ? `${item.bedrooms} BHK` : "N/A" },
                { label: "Rent:", value: item?.rent != null ? `₹${item.rent}` : "N/A" },
              ]}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
