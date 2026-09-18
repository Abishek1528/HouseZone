import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import adminStyles, { ADMIN_COLORS } from "../../styles/admin/adminStyles";
import AdminPageHeader from "../../shared/components/AdminPageHeader";
import { getAllJobSeekersAdmin } from "./api";
import { getTimeAgo } from "../../shared/utils/timeUtils.js";

export default function JobSeekerAdminPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllJobSeekersAdmin();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching admin job seeker applications:", error);
      Alert.alert("Error", "Failed to fetch job seeker applications");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusBadgeStyle = (status) => {
    const s = String(status || "pending").toLowerCase();
    if (s === "accepted") return { bg: "#dcfce7", text: "#15803d", label: "Accepted" };
    if (s === "declined") return { bg: "#fee2e2", text: "#b91c1c", label: "Declined" };
    return { bg: "#fef3c7", text: "#b45309", label: "Pending" };
  };

  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader
        title="Job Seekers"
        subtitle="Review job seeker applications and their applied companies"
      />

      <View style={localStyles.topBar}>
        <Text style={localStyles.totalCountText}>
          Total Applications:{" "}
          <Text style={{ fontWeight: "700", color: ADMIN_COLORS.primary }}>
            {data.length}
          </Text>
        </Text>
        <TouchableOpacity style={localStyles.refreshBtn} onPress={fetchData}>
          <Text style={localStyles.refreshBtnText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={adminStyles.body}
        contentContainerStyle={adminStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={adminStyles.loadingWrap}>
            <ActivityIndicator size="large" color={ADMIN_COLORS.primary} />
          </View>
        ) : !Array.isArray(data) || data.length === 0 ? (
          <Text style={adminStyles.noDataText}>No job seeker applications found</Text>
        ) : (
          data.map((item) => {
            const isExpanded = expandedCards[item.id];
            const badge = getStatusBadgeStyle(item.status);
            const timeAgo = getTimeAgo(item.createdAt);

            return (
              <View key={item.id || Math.random()} style={localStyles.card}>
                {/* Header info */}
                <View style={localStyles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Text style={localStyles.applicantName}>{item.fullName || "Applicant"}</Text>
                      <View style={[localStyles.statusBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[localStyles.statusBadgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={localStyles.appliedSubtitle}>
                      Applied for:{" "}
                      <Text style={{ fontWeight: "700", color: ADMIN_COLORS.primary }}>
                        {item.jobTitle || "Job Position"}
                      </Text>{" "}
                      at{" "}
                      <Text style={{ fontWeight: "700", color: "#1f2937" }}>
                        {item.shopName || "Company"}
                      </Text>
                    </Text>
                    {timeAgo ? <Text style={localStyles.timeText}>Applied {timeAgo}</Text> : null}
                  </View>

                  {item.profilePicture ? (
                    <Image
                      source={{ uri: item.profilePicture }}
                      style={localStyles.profileThumb}
                    />
                  ) : null}
                </View>

                {/* Main Summary Grid */}
                <View style={localStyles.summaryGrid}>
                  <View style={localStyles.gridItem}>
                    <Text style={localStyles.gridLabel}>Phone:</Text>
                    <Text style={localStyles.gridValue}>{item.mobileNumber || "N/A"}</Text>
                  </View>
                  <View style={localStyles.gridItem}>
                    <Text style={localStyles.gridLabel}>Age / Gender:</Text>
                    <Text style={localStyles.gridValue}>
                      {item.age ? `${item.age} yrs` : "N/A"} • {item.gender || "N/A"}
                    </Text>
                  </View>
                  <View style={localStyles.gridItem}>
                    <Text style={localStyles.gridLabel}>Education:</Text>
                    <Text style={localStyles.gridValue}>{item.education || "N/A"}</Text>
                  </View>
                  <View style={localStyles.gridItem}>
                    <Text style={localStyles.gridLabel}>Experience:</Text>
                    <Text style={localStyles.gridValue}>
                      {item.experience === "experienced"
                        ? `Experienced (${item.experienceYears || "1+ yrs"})`
                        : "Fresher"}
                    </Text>
                  </View>
                </View>

                {/* Expand / Collapse Button */}
                <TouchableOpacity
                  style={localStyles.expandBtn}
                  onPress={() => toggleExpand(item.id)}
                >
                  <Text style={localStyles.expandBtnText}>
                    {isExpanded ? "Hide Details ▲" : "View Full Details ▼"}
                  </Text>
                </TouchableOpacity>

                {/* Expanded Full Details */}
                {isExpanded && (
                  <View style={localStyles.expandedContent}>
                    {/* Applied Job & Company Section */}
                    <View style={localStyles.sectionBox}>
                      <Text style={localStyles.sectionTitle}>🏢 Applied Company & Job Details</Text>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Company Name:</Text>
                        <Text style={localStyles.detailValue}>{item.shopName || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Company Type:</Text>
                        <Text style={localStyles.detailValue}>{item.shopType || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Job Position:</Text>
                        <Text style={localStyles.detailValue}>{item.jobTitle || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Offered Salary:</Text>
                        <Text style={[localStyles.detailValue, { color: "#166534", fontWeight: "700" }]}>
                          {item.salaryOffering || "N/A"}
                        </Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Company Location:</Text>
                        <Text style={localStyles.detailValue}>
                          {[item.shopArea, item.shopCity].filter(Boolean).join(", ") || "N/A"}
                        </Text>
                      </View>
                      {item.shopContact && (
                        <View style={localStyles.row}>
                          <Text style={localStyles.detailLabel}>Company Contact:</Text>
                          <Text style={localStyles.detailValue}>{item.shopContact}</Text>
                        </View>
                      )}
                    </View>

                    {/* Applicant Information Section */}
                    <View style={localStyles.sectionBox}>
                      <Text style={localStyles.sectionTitle}>👤 Applicant Information</Text>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Full Name:</Text>
                        <Text style={localStyles.detailValue}>{item.fullName || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Mobile Number:</Text>
                        <Text style={localStyles.detailValue}>{item.mobileNumber || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Alternate Contact:</Text>
                        <Text style={localStyles.detailValue}>{item.contactNo || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Address:</Text>
                        <Text style={localStyles.detailValue}>
                          {[item.street, item.area, item.city].filter(Boolean).join(", ") || "N/A"}
                        </Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Aadhar Number:</Text>
                        <Text style={localStyles.detailValue}>{item.aadharNumber || "N/A"}</Text>
                      </View>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Can Join Immediately:</Text>
                        <Text style={[localStyles.detailValue, { fontWeight: "700", color: item.canJoinImmediately === "yes" ? "#166534" : "#1f2937" }]}>
                          {item.canJoinImmediately === "yes" ? "Yes" : "No"}
                        </Text>
                      </View>
                      {item.preferredEmploymentType && (
                        <View style={localStyles.row}>
                          <Text style={localStyles.detailLabel}>Preferred Type:</Text>
                          <Text style={localStyles.detailValue}>{item.preferredEmploymentType}</Text>
                        </View>
                      )}
                    </View>

                    {/* Experience Information Section */}
                    <View style={localStyles.sectionBox}>
                      <Text style={localStyles.sectionTitle}>💼 Experience Information</Text>
                      <View style={localStyles.row}>
                        <Text style={localStyles.detailLabel}>Status:</Text>
                        <Text style={localStyles.detailValue}>
                          {item.experience === "experienced" ? "Experienced" : "Fresher"}
                        </Text>
                      </View>
                      {item.experience === "experienced" && (
                        <>
                          <View style={localStyles.row}>
                            <Text style={localStyles.detailLabel}>Years of Experience:</Text>
                            <Text style={localStyles.detailValue}>{item.experienceYears || "N/A"}</Text>
                          </View>
                          <View style={localStyles.row}>
                            <Text style={localStyles.detailLabel}>Previous Company/Shop:</Text>
                            <Text style={localStyles.detailValue}>{item.lastWorkingShop || "N/A"}</Text>
                          </View>
                        </>
                      )}
                      {item.addExperience && (
                        <View style={{ marginTop: 6 }}>
                          <Text style={localStyles.detailLabel}>Additional Experience:</Text>
                          <Text style={[localStyles.detailValue, { marginTop: 2 }]}>
                            {item.addExperience}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    width: "100%",
  },
  totalCountText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  refreshBtn: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  refreshBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 10,
    marginBottom: 10,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  appliedSubtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  profileThumb: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: ADMIN_COLORS.primary,
    marginLeft: 10,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingVertical: 6,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  gridLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: "700",
  },
  expandBtn: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  expandBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: ADMIN_COLORS.primary,
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 12,
  },
  sectionBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    flexWrap: "wrap",
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "700",
  },
});
