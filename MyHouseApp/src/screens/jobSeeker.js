import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import { useTheme } from '../context/ThemeContext';
import { getJobListings } from './jobSeeker/logic/api';

const JobCard = ({ job, onViewDetails, tps, dark }) => {
  const { colors } = tps;
  if (!job) return null;

  return (
    <View style={tps.card}>
      <Image
        source={{ uri: job.shopPhoto1 }}
        style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0' }]}
        resizeMode="cover"
      />
      <View style={propertyListStyles.detailsContainer}>
        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {job.shopType} • {job.area}, {job.city}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: '#27ae60' }]}>
            ₹{job.salaryOffering}/month
          </Text>
        </View>
        <Text style={{ marginLeft: 12, marginRight: 12, marginBottom: 8, color: colors.text, fontWeight: '600', fontSize: 16 }}>
          {job.shopName}
        </Text>
        <TouchableOpacity
          style={[propertyListStyles.viewMoreButton, { borderTopColor: colors.border }]}
          onPress={() => onViewDetails(job)}
        >
          <Text style={[propertyListStyles.viewMoreText, { color: colors.primary }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function JobSeeker() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobListings();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching job listings:", error);
      Alert.alert("Error", "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [])
  );

  const handleViewDetails = (job) => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Job Listings"
        subtitle="Browse available jobs in your area"
      />
      <View style={propertyListStyles.content}>
        <View style={propertyListStyles.titleRow}>
          <Text style={tps.pageTitle}>Available Jobs</Text>
        </View>
        {loading ? (
          <Text style={tps.loadingText}>Loading jobs...</Text>
        ) : jobs.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No jobs available</Text>
        ) : (
          <FlatList
            data={jobs}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <JobCard job={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />}
            style={propertyListStyles.list}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}
