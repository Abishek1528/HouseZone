import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import AdminImageGallery from "../../shared/components/AdminImageGallery";
import { useNavigation, useRoute } from "@react-navigation/native";
import AdminPageHeader from "../../shared/components/AdminPageHeader";
import adminStyles, { ADMIN_COLORS } from "../../styles/admin/adminStyles";
import residentialOwnerStyles from "../../styles/admin/residentialOwnerStyles";
import {
  getAllJobGivers,
  getJobTitles,
  addJobTitle,
  deleteJobTitle,
  getJobAreas,
  addJobArea,
  deleteJobArea
} from "./api";

export default function JobGiverAdminPage() {
  const navigation = useNavigation();
  const route = useRoute();

  const [jobGivers, setJobGivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  // Add Option Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("jobTitle"); // 'jobTitle' | 'area'
  
  // Job Titles state
  const [jobTitlesList, setJobTitlesList] = useState([]);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  // Areas state
  const [jobAreasList, setJobAreasList] = useState([]);
  const [newJobArea, setNewJobArea] = useState("");
  const [savingArea, setSavingArea] = useState(false);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [giversData, titlesData, areasData] = await Promise.all([
        getAllJobGivers().catch(() => []),
        getJobTitles().catch(() => []),
        getJobAreas().catch(() => [])
      ]);

      setJobGivers(Array.isArray(giversData) ? giversData : []);
      setJobTitlesList(Array.isArray(titlesData) ? titlesData : []);
      setJobAreasList(Array.isArray(areasData) ? areasData : []);
    } catch (error) {
      console.error("Error loading job givers data:", error);
      Alert.alert("Error", "Failed to load job givers. Please try again.");
      setJobGivers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadJobTitles = async () => {
    try {
      const data = await getJobTitles();
      setJobTitlesList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading titles:", err);
    }
  };

  const loadJobAreas = async () => {
    try {
      const data = await getJobAreas();
      setJobAreasList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading areas:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddJobTitle = async () => {
    if (!newJobTitle.trim()) {
      Alert.alert("Validation Error", "Please enter a job title");
      return;
    }
    try {
      setSavingTitle(true);
      await addJobTitle(newJobTitle.trim());
      setNewJobTitle("");
      Alert.alert("Success", "Job title added successfully! It will now appear in user forms.");
      await loadJobTitles();
    } catch (err) {
      console.error("Error adding job title:", err);
      Alert.alert("Error", err.message || "Failed to add job title");
    } finally {
      setSavingTitle(false);
    }
  };

  const handleDeleteJobTitle = (item) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteJobTitle(item.id);
              await loadJobTitles();
            } catch (err) {
              Alert.alert("Error", "Failed to delete job title");
            }
          }
        }
      ]
    );
  };

  const handleAddJobArea = async () => {
    if (!newJobArea.trim()) {
      Alert.alert("Validation Error", "Please enter an area name");
      return;
    }
    try {
      setSavingArea(true);
      await addJobArea(newJobArea.trim());
      setNewJobArea("");
      Alert.alert("Success", "Area added successfully! It will now appear in user forms.");
      await loadJobAreas();
    } catch (err) {
      console.error("Error adding area:", err);
      Alert.alert("Error", err.message || "Failed to add area");
    } finally {
      setSavingArea(false);
    }
  };

  const handleDeleteJobArea = (item) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteJobArea(item.id);
              await loadJobAreas();
            } catch (err) {
              Alert.alert("Error", "Failed to delete area");
            }
          }
        }
      ]
    );
  };

  const renderJobCard = ({ item }) => {
    const isExpanded = expandedCards[item.id];
    return (
      <View style={residentialOwnerStyles.ownerCard}>
        {/* Summary View */}
        <View style={residentialOwnerStyles.summaryContainer}>
          <View style={residentialOwnerStyles.summaryLeft}>
            <Text style={residentialOwnerStyles.ownerName}>{item.shopName || "Unknown Company"}</Text>
            <Text style={residentialOwnerStyles.summaryText}>
              <Text style={{ fontWeight: "700", color: ADMIN_COLORS.primary }}>Job:</Text> {item.jobTitle || "N/A"} ({item.employmentType || "Full-time"})
            </Text>
            <Text style={residentialOwnerStyles.summaryText}>
              <Text style={{ fontWeight: "700", color: "#166534" }}>Salary:</Text> {item.salaryOffering || "Not specified"}
            </Text>
            <Text style={residentialOwnerStyles.summaryText}>
              <Text style={{ fontWeight: "600" }}>Location:</Text> {item.area || "N/A"}, {item.city || "N/A"}
            </Text>
            <Text style={residentialOwnerStyles.summaryText}>
              <Text style={{ fontWeight: "600" }}>Contact:</Text> {item.contact || "N/A"}
            </Text>
          </View>
          {!isExpanded && (
            <TouchableOpacity
              style={residentialOwnerStyles.viewMoreButton}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={residentialOwnerStyles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Detailed View */}
        {isExpanded && (
          <View style={residentialOwnerStyles.detailedContainer}>
            {/* Images Gallery */}
            {Array.isArray(item.images) && item.images.length > 0 && (
              <View style={residentialOwnerStyles.detailSection}>
                <Text style={residentialOwnerStyles.sectionTitle}>Shop / Company Photos</Text>
                <AdminImageGallery images={item.images} />
              </View>
            )}

            {/* Company & Owner Information */}
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Company & Owner Information</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Job Giver ID:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.id}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Owner Name:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.ownerName || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Company / Shop Name:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.shopName || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Company Type:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.shopType || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Area:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.area || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>City:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.city || "N/A"}</Text>
              </Text>
              {!!item.landmark && (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Landmark:</Text>{" "}
                  <Text style={residentialOwnerStyles.detailValue}>{item.landmark}</Text>
                </Text>
              )}
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Contact Number:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.contact || "N/A"}</Text>
              </Text>
            </View>

            {/* Job Details */}
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Job Requirements & Timings</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Job Title:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.jobTitle || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Employment Type:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.employmentType || "N/A"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Age Requirement:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.age || "Any"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Gender Requirement:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.gender || "Any"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Education Requirement:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.education || "Any"}</Text>
              </Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Experience Required:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>{item.experienceYear || "Any"}</Text>
              </Text>
              {!!item.experienceField && (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Experience Field:</Text>{" "}
                  <Text style={residentialOwnerStyles.detailValue}>{item.experienceField}</Text>
                </Text>
              )}
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Working Timings:</Text>{" "}
                <Text style={residentialOwnerStyles.detailValue}>
                  {item.workingTimings || (item.workingTimeStart && item.workingTimeEnd ? `${item.workingTimeStart} - ${item.workingTimeEnd}` : "N/A")}
                </Text>
              </Text>
            </View>

            {/* Salary & Other Skills */}
            <View style={residentialOwnerStyles.detailSection}>
              <Text style={residentialOwnerStyles.sectionTitle}>Salary & Skills</Text>
              <Text style={residentialOwnerStyles.detailText}>
                <Text style={residentialOwnerStyles.detailLabel}>Salary Offering:</Text>{" "}
                <Text style={[residentialOwnerStyles.detailValue, { color: "#166534", fontWeight: "700" }]}>
                  {item.salaryOffering || "N/A"}
                </Text>
              </Text>
              {!!item.otherSkills && (
                <Text style={residentialOwnerStyles.detailText}>
                  <Text style={residentialOwnerStyles.detailLabel}>Other Skills / Notes:</Text>{" "}
                  <Text style={residentialOwnerStyles.detailValue}>{item.otherSkills}</Text>
                </Text>
              )}
            </View>

            {/* Collapse button */}
            <TouchableOpacity
              style={[residentialOwnerStyles.viewMoreButton, { alignSelf: "center", marginTop: 12 }]}
              onPress={() => toggleExpand(item.id)}
            >
              <Text style={residentialOwnerStyles.viewMoreText}>View Less</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader
        title="Job Givers"
        subtitle="Manage job postings, job titles, and areas"
      />

      {/* Top Action Bar with Add Button */}
      <View style={localStyles.topBar}>
        <Text style={localStyles.totalCountText}>
          Total Postings: <Text style={{ fontWeight: "700", color: ADMIN_COLORS.primary }}>{jobGivers.length}</Text>
        </Text>
        <TouchableOpacity
          style={localStyles.addOptionBtn}
          onPress={() => {
            setShowAddModal(true);
            loadJobTitles();
            loadJobAreas();
          }}
        >
          <Text style={localStyles.addOptionBtnText}>+ Add Options (Title/Area)</Text>
        </TouchableOpacity>
      </View>

      {/* Postings List */}
      <View style={{ flex: 1, width: "100%" }}>
        {loading ? (
          <View style={adminStyles.loadingWrap}>
            <ActivityIndicator size="large" color={ADMIN_COLORS.primary} />
          </View>
        ) : jobGivers.length === 0 ? (
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={adminStyles.noDataText}>No job giver postings found</Text>
          </View>
        ) : (
          <FlatList
            data={jobGivers}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderJobCard}
            contentContainerStyle={adminStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Add Job Title / Area Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalCard}>
            {/* Modal Header */}
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Manage Form Options</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={localStyles.closeBtn}>
                <Text style={localStyles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Option Tabs: Job Title & Area */}
            <View style={localStyles.tabContainer}>
              <TouchableOpacity
                style={[localStyles.tabBtn, activeTab === "jobTitle" && localStyles.activeTabBtn]}
                onPress={() => setActiveTab("jobTitle")}
              >
                <Text style={[localStyles.tabBtnText, activeTab === "jobTitle" && localStyles.activeTabBtnText]}>
                  Job Title ({jobTitlesList.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localStyles.tabBtn, activeTab === "area" && localStyles.activeTabBtn]}
                onPress={() => setActiveTab("area")}
              >
                <Text style={[localStyles.tabBtnText, activeTab === "area" && localStyles.activeTabBtnText]}>
                  Area ({jobAreasList.length})
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              {activeTab === "jobTitle" ? (
                <View>
                  <Text style={localStyles.sectionLabel}>Add New Job Title</Text>
                  <View style={localStyles.inputRow}>
                    <TextInput
                      style={localStyles.textInput}
                      placeholder="Enter new job title (e.g. Electrician)"
                      placeholderTextColor="#9ca3af"
                      value={newJobTitle}
                      onChangeText={setNewJobTitle}
                    />
                    <TouchableOpacity
                      style={[localStyles.addButton, savingTitle && { opacity: 0.6 }]}
                      onPress={handleAddJobTitle}
                      disabled={savingTitle}
                    >
                      {savingTitle ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={localStyles.addButtonText}>Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={[localStyles.sectionLabel, { marginTop: 18 }]}>
                    Existing Job Titles in User Forms:
                  </Text>
                  <View style={localStyles.chipsContainer}>
                    {jobTitlesList.map((t) => (
                      <View key={t.id || t.title} style={localStyles.chip}>
                        <Text style={localStyles.chipText}>{t.title}</Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteJobTitle(t)}
                          style={localStyles.chipDelete}
                        >
                          <Text style={localStyles.chipDeleteText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={localStyles.sectionLabel}>Add New Area</Text>
                  <View style={localStyles.inputRow}>
                    <TextInput
                      style={localStyles.textInput}
                      placeholder="Enter new area (e.g. Gandhi Nagar)"
                      placeholderTextColor="#9ca3af"
                      value={newJobArea}
                      onChangeText={setNewJobArea}
                    />
                    <TouchableOpacity
                      style={[localStyles.addButton, savingArea && { opacity: 0.6 }]}
                      onPress={handleAddJobArea}
                      disabled={savingArea}
                    >
                      {savingArea ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <Text style={localStyles.addButtonText}>Add</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={[localStyles.sectionLabel, { marginTop: 18 }]}>
                    Existing Areas in User Forms:
                  </Text>
                  <View style={localStyles.chipsContainer}>
                    {jobAreasList.map((a) => (
                      <View key={a.id || a.name} style={localStyles.chip}>
                        <Text style={localStyles.chipText}>{a.name}</Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteJobArea(a)}
                          style={localStyles.chipDelete}
                        >
                          <Text style={localStyles.chipDeleteText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <TouchableOpacity
              style={localStyles.modalCloseBottomBtn}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={localStyles.modalCloseBottomText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addOptionBtn: {
    backgroundColor: ADMIN_COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  addOptionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "700",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: ADMIN_COLORS.primary,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4b5563",
  },
  activeTabBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#1f2937",
    backgroundColor: "#f9fafb",
  },
  addButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e40af",
  },
  chipDelete: {
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  chipDeleteText: {
    fontSize: 10,
    color: "#ef4444",
    fontWeight: "800",
  },
  modalCloseBottomBtn: {
    marginTop: 18,
    backgroundColor: ADMIN_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseBottomText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
