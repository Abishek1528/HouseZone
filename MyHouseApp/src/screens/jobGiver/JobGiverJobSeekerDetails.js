import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import propertyDetailsStyles from '../residential/tenant/propertyDetailsStyles';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobSeekerDetails, acceptJobSeeker, declineJobSeeker } from './logic/api';

export default function JobGiverJobSeekerDetails({ route }) {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const { jobSeekerId } = route.params || {};
  const [jobSeeker, setJobSeeker] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJobSeekerDetails = async () => {
    try {
      setLoading(true);
      const data = await getJobSeekerDetails(jobSeekerId);
      setJobSeeker(data);
    } catch (error) {
      console.error("Error fetching job seeker details:", error);
      Alert.alert("Error", "Failed to load job seeker details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobSeekerId) {
      fetchJobSeekerDetails();
    }
  }, [jobSeekerId]);

  const handleAccept = async () => {
    try {
      await acceptJobSeeker(jobSeekerId);
      // Refresh the data after accepting
      await fetchJobSeekerDetails();
      Alert.alert("Success", "Application accepted!", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error accepting job seeker:", error);
      Alert.alert("Error", "Failed to accept application.");
    }
  };

  const handleDecline = async () => {
    try {
      await declineJobSeeker(jobSeekerId);
      // Refresh the data after declining
      await fetchJobSeekerDetails();
      Alert.alert("Success", "Application declined.", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error declining job seeker:", error);
      Alert.alert("Error", "Failed to decline application.");
    }
  };

  const getStatusColor = () => {
    if (jobSeeker?.status === 'accepted') return '#27ae60';
    if (jobSeeker?.status === 'declined') return '#e74c3c';
    return '#f39c12';
  };

  if (loading) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader
          title="Job Seeker Details"
          subtitle="Loading..."
        />
        <Text style={tps.loadingText}>Loading job seeker details...</Text>
        <Footer />
      </View>
    );
  }

  if (!jobSeeker) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader
          title="Job Seeker Details"
          subtitle="Not found"
        />
        <Text style={propertyDetailsStyles.errorText}>Job seeker not found</Text>
        <Footer />
      </View>
    );
  }

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title={jobSeeker.fullName || 'Job Seeker Details'}
        subtitle="View full details"
      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {jobSeeker.status && (
          <View style={{ 
            marginVertical: 12, 
            padding: 12, 
            backgroundColor: getStatusColor() + '20',
            borderRadius: 12,
            alignItems: 'center'
          }}>
            <Text style={{ 
              color: getStatusColor(), 
              fontWeight: 'bold', 
              fontSize: 16,
              textTransform: 'capitalize'
            }}>
              Status: {jobSeeker.status}
            </Text>
          </View>
        )}
        <ScrollView
          style={propertyDetailsStyles.scrollContainer}
          contentContainerStyle={propertyDetailsStyles.scrollContentContainer}
          nestedScrollEnabled
        >
          {/* Personal Info Section */}
          <View style={tps.section}>
            <Text style={tps.sectionTitle}>Personal Information</Text>
            <View style={tps.firstDetailRow}>
              <Text style={tps.label}>Full Name</Text>
              <Text style={tps.value}>{jobSeeker.fullName || 'N/A'}</Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Age</Text>
              <Text style={tps.value}>{jobSeeker.age || 'N/A'}</Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Gender</Text>
              <Text style={tps.value}>{jobSeeker.gender || 'N/A'}</Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Mobile Number</Text>
              <Text style={tps.value}>{jobSeeker.mobileNumber || 'N/A'}</Text>
            </View>
            {jobSeeker.aadharNumber && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Aadhar Number</Text>
                <Text style={tps.value}>{jobSeeker.aadharNumber}</Text>
              </View>
            )}
          </View>

          {/* Education & Experience Section */}
          <View style={tps.section}>
            <Text style={tps.sectionTitle}>Education & Experience</Text>
            <View style={tps.firstDetailRow}>
              <Text style={tps.label}>Education</Text>
              <Text style={tps.value}>{jobSeeker.education || 'N/A'}</Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Experience</Text>
              <Text style={tps.value}>{jobSeeker.experience || 'N/A'}</Text>
            </View>
            {jobSeeker.experienceYears && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Experience Years</Text>
                <Text style={tps.value}>{jobSeeker.experienceYears}</Text>
              </View>
            )}
            {jobSeeker.lastWorkingShop && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Last Working Shop</Text>
                <Text style={tps.value}>{jobSeeker.lastWorkingShop}</Text>
              </View>
            )}
            {jobSeeker.otherSkills && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Other Skills</Text>
                <Text style={tps.value}>{jobSeeker.otherSkills}</Text>
              </View>
            )}
          </View>

          {/* Availability Section */}
          <View style={tps.section}>
            <Text style={tps.sectionTitle}>Availability</Text>
            <View style={tps.firstDetailRow}>
              <Text style={tps.label}>Can Join Immediately</Text>
              <Text style={tps.value}>{jobSeeker.canJoinImmediately || 'N/A'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {(!jobSeeker.status || jobSeeker.status === 'pending') && (
        <View style={[tps.bottomBar, { paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', gap: 12 }]}>
          <TouchableOpacity style={[tps.btnOutline, { flex: 1, borderColor: '#e74c3c' }]} onPress={handleDecline}>
            <Text style={[tps.btnOutlineText, { color: '#e74c3c' }]}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[tps.btnPrimary, { flex: 1, backgroundColor: '#27ae60' }]} onPress={handleAccept}>
            <Text style={tps.btnPrimaryText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
      <Footer />
    </View>
  );
}
