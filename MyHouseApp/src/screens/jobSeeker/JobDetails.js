import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import propertyDetailsStyles from '../residential/tenant/propertyDetailsStyles';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobDetails } from './logic/api';

export default function JobDetails({ route }) {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const { jobId, job: initialJob } = route.params || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const data = await getJobDetails(jobId);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        Alert.alert("Error", "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };
    if (initialJob) {
      setJob(initialJob);
      setLoading(false);
    } else if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, initialJob]);

  const handleProceed = () => {
    navigation.navigate('JobSeekerForm', { job });
  };

  if (loading) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader
          title="Job Details"
          subtitle="Loading..."
        />
        <Text style={tps.loadingText}>Loading job details...</Text>
        <Footer />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={tps.screen}>
        <Header />
        <TenantPageHeader
          title="Job Details"
          subtitle="Not found"
        />
        <Text style={propertyDetailsStyles.errorText}>Job not found</Text>
        <Footer />
      </View>
    );
  }

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title={job?.shopName || 'Job Details'}
        subtitle="Review job details"
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Shop Image */}
        {job?.shopPhoto1 && (
          <View style={{ marginVertical: 10 }}>
            <Image
              source={{ uri: job.shopPhoto1 }}
              style={{ width: '100%', height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Job Overview */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Job Overview</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Shop Name</Text>
            <Text style={tps.value}>{job?.shopName || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Job Title</Text>
            <Text style={[tps.value, { color: '#3b82f6', fontWeight: '700' }]}>{job?.jobTitle || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Shop Type</Text>
            <Text style={tps.value}>{job?.shopType || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Area</Text>
            <Text style={tps.value}>{job?.area || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>City</Text>
            <Text style={tps.value}>{job?.city || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Salary Offering</Text>
            <Text style={[tps.value, { color: '#27ae60', fontWeight: '700' }]}>
              ₹{job?.salaryOffering || 'N/A'}/month
            </Text>
          </View>
        </View>

        {/* Job Requirements */}
        <View style={tps.section}>
          <Text style={tps.sectionTitle}>Job Requirements</Text>
          <View style={tps.firstDetailRow}>
            <Text style={tps.label}>Age</Text>
            <Text style={tps.value}>{job?.age || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Gender</Text>
            <Text style={tps.value}>{job?.gender || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Education</Text>
            <Text style={tps.value}>{job?.education || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Experience Year</Text>
            <Text style={tps.value}>{job?.experienceYear || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Experience Field</Text>
            <Text style={tps.value}>{job?.experienceField || 'N/A'}</Text>
          </View>
          <View style={tps.detailRow}>
            <Text style={tps.label}>Working Time</Text>
            <Text style={tps.value}>{job?.workingTimeStart} - {job?.workingTimeEnd}</Text>
          </View>
          {job?.otherSkills && (
            <View style={tps.detailRow}>
              <Text style={tps.label}>Other Skills</Text>
              <Text style={tps.value}>{job.otherSkills}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[tps.bottomBar, { paddingHorizontal: 16, paddingBottom: 12 }]}>
        <TouchableOpacity style={tps.btnOutline} onPress={() => navigation.goBack()}>
          <Text style={tps.btnOutlineText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tps.btnPrimary} onPress={handleProceed}>
          <Text style={tps.btnText}>Click OK to Proceed</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}
