import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import { useTheme } from '../context/ThemeContext';
import { getJobListings, getJobSeekerById } from './jobSeeker/logic/api';

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

const getStatusColor = (status) => {
  if (status === 'accepted') return '#27ae60';
  if (status === 'declined') return '#e74c3c';
  return '#f39c12';
};

export default function JobSeeker() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myApplication, setMyApplication] = useState(null);
  const [jobSeekerId, setJobSeekerId] = useState(null);

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

  const checkMyApplication = async () => {
    try {
      const storedId = await AsyncStorage.getItem('jobSeekerId');
      if (storedId) {
        setJobSeekerId(storedId);
        const data = await getJobSeekerById(storedId);
        setMyApplication(data);
      } else {
        setMyApplication(null);
        setJobSeekerId(null);
      }
    } catch (error) {
      console.error("Error fetching my application:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
      checkMyApplication();
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
        {myApplication && (
          <View style={{ 
            marginBottom: 16, 
            padding: 16, 
            backgroundColor: getStatusColor(myApplication.status) + '20',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: getStatusColor(myApplication.status) + '40'
          }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: 'bold', 
              color: getStatusColor(myApplication.status) 
            }}>
              My Application Status: {myApplication.status.charAt(0).toUpperCase() + myApplication.status.slice(1)}
            </Text>
            <Text style={{ marginTop: 4, color: tps.colors.text, fontSize: 14 }}>
              Thank you for applying! We'll keep you updated on your status.
            </Text>
          </View>
        )}
        
        {!jobSeekerId && (
          <TouchableOpacity 
            style={{ 
              marginBottom: 16, 
              padding: 16, 
              backgroundColor: tps.colors.primary + '20',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: tps.colors.primary + '40'
            }}
            onPress={() => navigation.navigate('JobSeekerForm')}
          >
            <Text style={{ color: tps.colors.primary, fontWeight: 'bold', fontSize: 16 }}>
              Apply as a Job Seeker
            </Text>
            <Text style={{ marginTop: 4, color: tps.colors.text, fontSize: 14 }}>
              Create your profile to start applying for jobs
            </Text>
          </TouchableOpacity>
        )}
        
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
