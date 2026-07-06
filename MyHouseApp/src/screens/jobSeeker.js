import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  const [hasApplications, setHasApplications] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, storedMobile] = await Promise.all([
        getJobListings(),
        AsyncStorage.getItem('jobSeekerMobile')
      ]);
      
      setJobs(jobsData);
      setHasApplications(!!storedMobile);
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
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16 }}>
          {hasApplications && (
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: tps.colors.primary,
                borderRadius: 8
              }}
              onPress={() => navigation.navigate('JobSeekerMyApplications')}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>My Applications</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {!hasApplications && (
          <TouchableOpacity
            style={{
              marginBottom: 16,
              marginTop: 8,
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
          jobs.map((item) => (
            <JobCard key={String(item.id)} job={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />
          ))
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
