import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import TenantFilterPanel from '../shared/components/TenantFilterPanel';
import { useTheme } from '../context/ThemeContext';
import { getOwnerFormThemeColors } from '../styles/ownerFormStyles';
import { getJobListings } from './jobSeeker/logic/api';
import { getTimeAgo } from '../shared/utils/timeUtils.js';

const JobCard = ({ job, onViewDetails, tps, dark }) => {
  const { colors } = tps;
  if (!job) return null;

  const salaryDisplay = formatSalaryForDisplay(job.salaryOffering);

  return (
    <View style={tps.card}>
      {/* Left side: Image + employment type */}
      <View style={{ flexDirection: 'column', alignItems: 'center', width: 120, minWidth: 120 }}>
        {job.shopPhoto1 ? (
          <Image
            source={{ uri: job.shopPhoto1 }}
            style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0', marginRight: 0 }]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[propertyListStyles.imagePlaceholder, { justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#333' : '#f0f0f0', marginRight: 0 }]}
          >
            <Text style={{ fontSize: 36 }}>🏪</Text>
          </View>
        )}
        <Text style={{ color: colors.text, fontWeight: '500', fontSize: 11, marginTop: 6, textAlign: 'center' }}>
          {job.employmentType}
        </Text>
        <Text style={{ color: colors.subText, fontSize: 10, fontWeight: '500', marginTop: 4, textAlign: 'center' }}>
          Posted {getTimeAgo(job.createdAt)}
        </Text>
      </View>
      {/* Right side: Company name, job title, area/salary box, view details */}
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {/* Company Name */}
        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18 }}>
          {job.shopName}
        </Text>
        {/* Job Title */}
        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16, marginTop: 4 }}>
          {job.jobTitle}
        </Text>
        {/* Area and Salary box */}
        <View style={{ 
          marginTop: 8, 
          padding: 10, 
          backgroundColor: dark ? '#1e3a5f' : '#e7f0ff', 
          borderRadius: 12, 
          borderWidth: 1, 
          borderColor: dark ? '#374151' : '#dbeafe' 
        }}>
          <Text style={{ color: colors.text, fontWeight: '500', fontSize: 14 }}>
            📍 {job.area || 'Area not specified'}
          </Text>
          <Text style={{ color: salaryDisplay ? '#27ae60' : '#9ca3af', fontWeight: salaryDisplay ? '700' : '400', fontSize: 14, marginTop: 4 }}>
            {salaryDisplay ? `💰 ${salaryDisplay}` : 'Salary not specified'}
          </Text>
        </View>
        {/* View Details button aligned to right */}
        <TouchableOpacity
          style={{ marginTop: 8, alignSelf: 'flex-end' }}
          onPress={() => onViewDetails(job)}
        >
          <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800' }}>View Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove, tps }) => {
  const { colors } = tps;
  if (!value) return null;
  
  return (
    <View style={propertyListStyles.selectedFilterBox}>
      <View style={propertyListStyles.selectedFilterContent}>
        <Text style={[propertyListStyles.selectedFilterText, { color: colors.text }]}>
          {label}: {value}
        </Text>
        <TouchableOpacity onPress={onRemove} style={propertyListStyles.removeFilterButton}>
          <Text style={propertyListStyles.removeFilterText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const EMPLOYMENT_TYPE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Part-time", value: "part-time" },
  { label: "Full-time", value: "full-time" },
];

const SALARY_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "≤10k", value: "0-10000" },
  { label: "10k-20k", value: "10000-20000" },
  { label: ">20k", value: "20000-999999" },
];

// Get label for salary filter value
const getSalaryLabel = (value) => {
  switch(value) {
    case '0-10000': return '≤10k';
    case '10000-20000': return '10k-20k';
    case '20000-999999': return '>20k';
    default: return '';
  }
};

const getEmploymentTypeLabel = (value) => {
  switch(value) {
    case 'full-time': return 'Full-time';
    case 'part-time': return 'Part-time';
    default: return '';
  }
};

const formatSalaryForDisplay = (raw) => {
  if (raw == null) return '';
  const str = String(raw).trim();
  if (!str) return '';
  // Strip any leading/trailing underscores and common placeholders
  let cleaned = str.replace(/^_+|_+$/g, '').replace(/_+/g, ' ');
  // If it looks like a pure number, format nicely
  if (/^\d+$/.test(cleaned)) {
    const num = parseInt(cleaned, 10);
    if (num >= 1000) {
      const k = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1);
      return `${k}k / month`;
    }
    return `${num} / month`;
  }
  // If it contains "month" or "/" already, just return cleaned
  if (/month|\/|\-|to/i.test(cleaned)) {
    // Ensure "/ month" exists cleanly
    if (!/month/i.test(cleaned)) {
      return `${cleaned} / month`;
    }
    return cleaned;
  }
  return `${cleaned} / month`;
};

const JOB_TITLE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Manager", value: "Manager" },
  { label: "Cashier", value: "Cashier" },
  { label: "Salesperson", value: "Salesperson" },
  { label: "Accountant", value: "Accountant" },
  { label: "Supervisor", value: "Supervisor" },
  { label: "Helper", value: "Helper" },
];

const AREA_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Vandigate", value: "Vandigate" },
  { label: "Ammapettai", value: "Ammapettai" },
  { label: "Omakulam", value: "Omakulam" },
  { label: "Anamalai Nagar", value: "Anamalai Nagar" },
  { label: "Chidambaram Town", value: "Chidambaram Town" },
];

export default function JobSeeker() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [hasApplications, setHasApplications] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [salaryFilter, setSalaryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      setFetchError(null);
      const [jobsData, storedMobile] = await Promise.all([
        getJobListings(filters),
        AsyncStorage.getItem('jobSeekerMobile')
      ]);

      if (!Array.isArray(jobsData)) {
        setJobs([]);
        setFetchError(new Error('Unexpected response from server'));
      } else {
        setJobs(jobsData);
      }
      setHasApplications(!!storedMobile);
    } catch (error) {
      console.error("Error fetching data:", error);
      setJobs([]);
      setFetchError(error || new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {};
    if (jobTitleFilter) filters.jobTitle = jobTitleFilter;
    if (areaFilter) filters.area = areaFilter;
    if (employmentTypeFilter) filters.employmentType = employmentTypeFilter;
    if (salaryFilter) {
      const [min, max] = salaryFilter.split('-').map(Number);
      filters.minSalary = min;
      filters.maxSalary = max;
    }

    fetchData(filters);
  }, [jobTitleFilter, areaFilter, salaryFilter, employmentTypeFilter]);

  const handleViewDetails = (job) => {
    navigation.navigate('JobDetails', { jobId: job.id, job });
  };

  const listHeader = () => (
    <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 8, gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {hasApplications && (
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: tps.colors.primary,
                borderRadius: 8,
              }}
              onPress={() => navigation.navigate('JobSeekerMyApplications')}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>My Applications</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: '#10b981',
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate('JobSeekerProfileForm')}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Add My Profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tps.filterBtn}
          onPress={() => setIsFilterVisible(!isFilterVisible)}
        >
          <Text style={tps.filterBtnText}>
            {isFilterVisible ? "Hide Filter" : "Filter"}{" "}
            {isFilterVisible ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
      </View>

      {isFilterVisible && (
        <TenantFilterPanel
          colors={themeColors}
          sections={[
            {
              key: "jobTitle",
              label: "Job Title",
              options: JOB_TITLE_FILTER_OPTIONS,
              value: jobTitleFilter,
              onSelect: setJobTitleFilter,
            },
            {
              key: "area",
              label: "Area",
              options: AREA_FILTER_OPTIONS,
              value: areaFilter,
              onSelect: setAreaFilter,
            },
            {
              key: "employmentType",
              label: "Employment Type",
              options: EMPLOYMENT_TYPE_FILTER_OPTIONS,
              value: employmentTypeFilter,
              onSelect: setEmploymentTypeFilter,
            },
            {
              key: "salary",
              label: "Salary",
              options: SALARY_FILTER_OPTIONS,
              value: salaryFilter,
              onSelect: setSalaryFilter,
            },
          ]}
        />
      )}

      {/* Display selected filters horizontally with remove option */}
      <View style={[propertyListStyles.selectedFiltersContainer, { marginTop: 8 }]}>
        <SelectedFilterBox
          label="Job Title"
          value={jobTitleFilter}
          onRemove={() => setJobTitleFilter("")}
          tps={tps}
        />
        <SelectedFilterBox
          label="Area"
          value={areaFilter}
          onRemove={() => setAreaFilter("")}
          tps={tps}
        />
        <SelectedFilterBox
          label="Employment Type"
          value={getEmploymentTypeLabel(employmentTypeFilter)}
          onRemove={() => setEmploymentTypeFilter("")}
          tps={tps}
        />
        <SelectedFilterBox
          label="Salary"
          value={getSalaryLabel(salaryFilter)}
          onRemove={() => setSalaryFilter("")}
          tps={tps}
        />
      </View>

      <View style={{ marginTop: 4 }}>
        {!hasApplications && (
          <TouchableOpacity
            style={{
              marginBottom: 8,
              padding: 16,
              backgroundColor: tps.colors.primary + '20',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: tps.colors.primary + '40'
            }}
            onPress={() => {
              Alert.alert(
                "Join a Company",
                "Please select a job from the list below, then click OK on the details screen to join!",
                [{ text: "OK" }]
              )
            }}
          >
            <Text style={{ color: tps.colors.primary, fontWeight: 'bold', fontSize: 16 }}>
              Join a Company
            </Text>
            <Text style={{ marginTop: 4, color: tps.colors.text, fontSize: 14 }}>
              Select a job below to view company details and apply
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={tps.pageTitle}>Companies Hiring</Text>

      <View style={{ marginBottom: 10, marginTop: 8 }}>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          {loading ? 'Loading...' : `${jobs.length} job${jobs.length === 1 ? '' : 's'} found`}
        </Text>
      </View>

      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading companies...</Text>
        </View>
      ) : fetchError ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={[propertyListStyles.noPropertiesText, { color: '#dc2626' }]}>
            Couldn't load companies
          </Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            Make sure your backend server is running and database is reachable.
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: '#2563eb',
              borderRadius: 8,
            }}
            onPress={() => fetchData()}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : jobs.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={propertyListStyles.noPropertiesText}>No companies hiring right now</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            Check back later for new job openings in your area.
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={tps.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Header />
      <TenantPageHeader
        title="Job Seekers"
        subtitle="Browse companies and join a job"
      />
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard job={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />
        )}
        keyExtractor={(item) => (item?.id || Math.random()).toString()}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
      />
      <Footer />
    </KeyboardAvoidingView>
  );
}
