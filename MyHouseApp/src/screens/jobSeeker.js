import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import { useTheme } from '../context/ThemeContext';
import { getJobListings, getJobSeekerApplications } from './jobSeeker/logic/api';

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

const ApplicationCard = ({ application, tps, dark }) => {
  const getStatusColor = () => {
    if (application?.status === 'accepted') return '#27ae60';
    if (application?.status === 'declined') return '#e74c3c';
    return '#f39c12';
  };

  return (
    <View style={[tps.card, { marginBottom: 16 }]}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
          {application.shopName || 'Unknown Company'}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {application.shopType} • {application.area}, {application.city}
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: getStatusColor(),
            textTransform: 'capitalize',
            backgroundColor: getStatusColor() + '20',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6
          }}>
            {application.status}
          </Text>
        </View>
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
  const [applications, setApplications] = useState([]);
  const [mobileNumber, setMobileNumber] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, storedMobile] = await Promise.all([
        getJobListings(),
        AsyncStorage.getItem('jobSeekerMobile')
      ]);
      
      setJobs(jobsData);
      setMobileNumber(storedMobile);
      
      if (storedMobile) {
        const apps = await getJobSeekerApplications(storedMobile);
        setApplications(apps);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleViewDetails = (job) => {
    navigation.navigate('JobDetails', { job });
  };

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Job Listings"
        subtitle="Browse available jobs in your area"
      />
      <View style={[propertyListStyles.content, { paddingBottom: 80 }]}>
        {applications.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[tps.pageTitle, { marginBottom: 12 }]}>My Applications</Text>
            {applications.map((app, index) => (
              <ApplicationCard key={index} application={app} tps={tps} dark={dark} />
            ))}
          </View>
        )}
        
        {!mobileNumber && (
          <TouchableOpacity
            style={{
              marginBottom: 16,
              padding: 16,
              backgroundColor: tps.colors.primary + '20',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: tps.colors.primary + '40'
            }}
            onPress={() => {
              Alert.alert(
                "Apply for Jobs",
                "Please select a job from the list below to apply!",
                [{ text: "OK" }]
              )
            }}
          >
            <Text style={{ color: tps.colors.primary, fontWeight: 'bold', fontSize: 16 }}>
              Apply for Jobs
            </Text>
            <Text style={{ marginTop: 4, color: tps.colors.text, fontSize: 14 }}>
              Select a job below to start your application
            </Text>
          </TouchableOpacity>
        )}
        
        <Text style={[tps.pageTitle, { marginBottom: 12 }]}>Available Jobs</Text>
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
