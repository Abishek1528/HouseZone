import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import propertyListStyles from '../residential/tenant/propertyListStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobSeekers } from './logic/api';

const JobSeekerCard = ({ jobSeeker, onViewDetails, tps, dark }) => {
  const { colors } = tps;
  if (!jobSeeker) return null;

  const getStatusColor = () => {
    if (jobSeeker?.status === 'accepted') return '#27ae60';
    if (jobSeeker?.status === 'declined') return '#e74c3c';
    return '#f39c12';
  };

  return (
    <View style={tps.card}>
      <View style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 40, color: dark ? '#888' : '#aaa' }}>👤</Text>
      </View>
      <View style={propertyListStyles.detailsContainer}>
        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {jobSeeker.experience} • {jobSeeker.education}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: getStatusColor() }]}>
            Age: {jobSeeker.age}
          </Text>
        </View>
        <Text style={{ marginLeft: 12, marginRight: 12, marginBottom: 4, color: colors.text, fontWeight: '600', fontSize: 16 }}>
          {jobSeeker.fullName}
        </Text>
        {jobSeeker.shopName && (
          <Text style={{ marginLeft: 12, marginRight: 12, marginBottom: 4, color: colors.text, fontSize: 14 }}>
            Applied to: {jobSeeker.shopName}
          </Text>
        )}
        <Text style={{ marginLeft: 12, marginRight: 12, marginBottom: 8, color: colors.text, fontSize: 14 }}>
          Gender: {jobSeeker.gender}
        </Text>
        <TouchableOpacity
          style={[propertyListStyles.viewMoreButton, { borderTopColor: colors.border }]}
          onPress={() => onViewDetails(jobSeeker)}
        >
          <Text style={[propertyListStyles.viewMoreText, { color: colors.primary }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function JobGiverJobSeekers() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      const data = await getJobSeekers();
      setJobSeekers(data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
      Alert.alert("Error", "Failed to load job seekers.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobSeekers();
    }, [])
  );

  const handleViewDetails = (jobSeeker) => {
    navigation.navigate('JobGiverJobSeekerDetails', { jobSeekerId: jobSeeker.id });
  };

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Job Seekers"
        subtitle="View all job seeker applications"
      />
      <View style={propertyListStyles.content}>
        <View style={propertyListStyles.titleRow}>
          <Text style={tps.pageTitle}>Available Job Seekers</Text>
        </View>
        {loading ? (
          <Text style={tps.loadingText}>Loading job seekers...</Text>
        ) : jobSeekers.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No job seekers available</Text>
        ) : (
          <FlatList
            data={jobSeekers}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <JobSeekerCard jobSeeker={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />}
            style={propertyListStyles.list}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}
