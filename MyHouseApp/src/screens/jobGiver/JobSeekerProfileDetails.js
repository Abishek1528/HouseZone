import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobSeekerProfileById } from '../jobSeeker/logic/api';

const capitalize = (str) => {
  if (!str) return "";
  const s = String(str);
  if (s.toLowerCase() === "ug" || s.toLowerCase() === "pg") return s.toUpperCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatExperienceYears = (val) => {
  if (!val) return "";
  const map = {
    "1year": "1 Year",
    "2years": "2 Years",
    "3years": "3 Years",
    "4plus": "4+ Years"
  };
  return map[String(val).toLowerCase()] || val;
};

export default function JobSeekerProfileDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const { profileId } = route.params || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        Alert.alert("Error", "Profile ID not provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getJobSeekerProfileById(profileId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        Alert.alert("Error", "Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const handleComeToInterview = () => {
    const name = profile?.name || "The candidate";
    Alert.alert(
      "Interview Confirmed",
      `${name} has been marked to come for an interview. You can contact them on ${profile?.phoneNumber || 'their number'} to schedule.`,
      [{ text: "OK", onPress: () => navigation.navigate("JobGiver") }]
    );
  };

  if (loading) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader title="Job Seeker Profile" subtitle="Loading..." />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={tps.loadingText}>Loading profile...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader title="Job Seeker Profile" subtitle="Not found" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#555', marginBottom: 20, textAlign: 'center' }}>Profile not found</Text>
          <TouchableOpacity
            style={tps.btnPrimary}
            onPress={() => navigation.goBack()}
          >
            <Text style={tps.btnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </View>
    );
  }

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title={profile.name || 'Job Seeker Profile'}
        subtitle={profile.experienceStatus === 'experienced' ? 'Experienced Candidate' : 'Fresher Candidate'}
      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
          nestedScrollEnabled
        >
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <View style={{ backgroundColor: dark ? '#374151' : '#eff6ff', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 30 }}>👤</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#2563eb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {profile.experienceStatus === 'experienced' ? 'Experienced' : 'Fresher'}
            </Text>
          </View>

          <View style={tps.section}>
            <Text style={tps.sectionTitle}>Personal Details</Text>
            <View style={tps.firstDetailRow}>
              <Text style={tps.label}>Age</Text>
              <Text style={tps.value}>{profile.age ? `${profile.age} years` : 'N/A'}</Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Gender</Text>
              <Text style={tps.value}>{capitalize(profile.gender) || 'N/A'}</Text>
            </View>
            {profile.area && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Area/Village</Text>
                <Text style={tps.value}>{profile.area}</Text>
              </View>
            )}
            {profile.city && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Town / City</Text>
                <Text style={tps.value}>{profile.city}</Text>
              </View>
            )}
            {profile.aadhar && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Aadhar Number</Text>
                <Text style={tps.value}>{profile.aadhar}</Text>
              </View>
            )}
            <View style={tps.detailRow}>
              <Text style={tps.label}>Phone Number</Text>
              <Text style={tps.value}>{profile.phoneNumber || 'N/A'}</Text>
            </View>
            {profile.createdAt && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Created On</Text>
                <Text style={tps.value}>{new Date(profile.createdAt).toLocaleDateString()}</Text>
              </View>
            )}
          </View>

          <View style={tps.section}>
            <Text style={tps.sectionTitle}>Educational Qualification</Text>
            <View style={tps.firstDetailRow}>
              <Text style={tps.label}>Education</Text>
              <Text style={tps.value}>{capitalize(profile.education) || 'N/A'}</Text>
            </View>
            <View style={tps.detailRow}>
              <Text style={tps.label}>Experience Status</Text>
              <Text style={tps.value}>{profile.experienceStatus === 'experienced' ? 'Experienced' : 'Fresher'}</Text>
            </View>
            {profile.experienceStatus === 'experienced' && (
              <>
                {profile.experienceYears && (
                  <View style={tps.detailRow}>
                    <Text style={tps.label}>Experience Years</Text>
                    <Text style={tps.value}>{formatExperienceYears(profile.experienceYears)}</Text>
                  </View>
                )}
                {profile.experienceField && (
                  <View style={tps.detailRow}>
                    <Text style={tps.label}>Experience Field</Text>
                    <Text style={tps.value}>{profile.experienceField}</Text>
                  </View>
                )}
              </>
            )}
            {profile.canJoinImmediately && (
              <View style={tps.detailRow}>
                <Text style={tps.label}>Can Join Immediately</Text>
                <Text style={tps.value}>{capitalize(profile.canJoinImmediately)}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[tps.bottomBar, { paddingHorizontal: 0, paddingBottom: 12, flexDirection: 'row' }]}>
          <TouchableOpacity
            style={[tps.btnOutline, { flex: 1, marginRight: 6 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={tps.btnOutlineText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tps.btnPrimary, { flex: 1, marginLeft: 6, backgroundColor: '#16a34a' }]}
            onPress={handleComeToInterview}
          >
            <Text style={tps.btnText}>Come to Interview</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}
