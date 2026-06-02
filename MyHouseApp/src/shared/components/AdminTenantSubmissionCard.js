import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import adminStyles from "../../styles/admin/adminStyles";
import { navigateToOwnerProperty } from "../admin/adminNavigation";

const DetailRow = ({ label, value }) => (
  <View style={adminStyles.detailRow}>
    <Text style={adminStyles.detailLabel}>{label}</Text>
    <Text style={adminStyles.detailValue}>{value ?? "N/A"}</Text>
  </View>
);

const AdminTenantSubmissionCard = ({
  item,
  ownerCategory,
  propertySectionTitle = "Property Details",
  propertyFields = [],
}) => {
  const navigation = useNavigation();
  const propertyId = item?.propertyId;
  const hasProperty = propertyId != null && propertyId !== "";

  const handleViewProperty = () => {
    navigateToOwnerProperty(navigation, ownerCategory, propertyId);
  };

  return (
    <View style={adminStyles.card}>
      <View style={adminStyles.cardHeader}>
        <View style={adminStyles.cardHeaderLeft}>
          <Text style={adminStyles.cardTitle}>Tenant: {item?.tenantName || "N/A"}</Text>
          <Text style={adminStyles.cardSubtitle}>Submission ID: {item?.tenantId ?? "N/A"}</Text>
        </View>
      </View>

      <View style={adminStyles.cardSection}>
        <Text style={adminStyles.sectionTitle}>Tenant Details</Text>
        <DetailRow label="Job:" value={item?.job} />
        <DetailRow label="Salary:" value={item?.salary != null ? `₹${item.salary}` : null} />
        <DetailRow label="Native:" value={item?.nativePlace} />
        <DetailRow label="Contact:" value={item?.mobileNumber} />
        {item?.alternateNumber ? (
          <DetailRow label="Alt:" value={item.alternateNumber} />
        ) : null}
      </View>

      <View style={adminStyles.cardSection}>
        <Text style={adminStyles.sectionTitle}>{propertySectionTitle}</Text>
        {hasProperty ? (
          <>
            {propertyFields.map((row) => (
              <DetailRow key={row.label} label={row.label} value={row.value} />
            ))}
            <TouchableOpacity style={adminStyles.viewPropertyBtn} onPress={handleViewProperty}>
              <Text style={adminStyles.viewPropertyBtnText}>View Property</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={adminStyles.noPropertyText}>No property associated</Text>
            <TouchableOpacity
              style={[adminStyles.viewPropertyBtn, adminStyles.viewPropertyBtnDisabled]}
              disabled
            >
              <Text style={adminStyles.viewPropertyBtnText}>View Property</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default AdminTenantSubmissionCard;
