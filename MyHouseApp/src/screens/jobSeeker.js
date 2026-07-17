import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
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

  return (
    <View style={tps.card}>
      <Image
        source={{ uri: job.shopPhoto1 }}
        style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#333' : '#f0f0f0' }]}
        resizeMode="cover"
      />
      <View style={propertyListStyles.detailsContainer}>
        {/* Company Name */}
        <Text style={{ marginLeft: 12, marginRight: 12, marginTop: 12, color: colors.text, fontWeight: '700', fontSize: 18 }}>
          {job.shopName}
        </Text>
        {/* Job Title */}
        <Text style={{ marginLeft: 12, marginRight: 12, marginTop: 4, color: colors.primary, fontWeight: '600', fontSize: 16 }}>
          {job.jobTitle}
        </Text>
        {/* Employment Type */}
        <Text style={{ marginLeft: 12, marginRight: 12, marginTop: 4, color: colors.text, fontWeight: '500', fontSize: 14 }}>
          {job.employmentType}
        </Text>
        {/* Area and Salary */}
        <View style={[tps.propertyInfo, { marginTop: 8 }]}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {job.area}, {job.city}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: '#27ae60' }]}>
            ₹{job.salaryOffering}/month
          </Text>
        </View>
        {/* Posted Ago */}
        <Text style={{ marginLeft: 12, marginRight: 12, marginTop: 8, marginBottom: 8, color: colors.subText, fontSize: 12, fontWeight: '500' }}>
          Posted {getTimeAgo(job.createdAt)}
        </Text>
        {/* View Details */}
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
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
];

const SALARY_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "5k-10k", value: "5000-10000" },
  { label: "10k-15k", value: "10000-15000" },
  { label: "15k-20k", value: "15000-20000" },
  { label: "20k-30k", value: "20000-30000" },
  { label: "30k+", value: "30000-999999" },
];

// Get label for salary filter value
const getSalaryLabel = (value) => {
  switch(value) {
    case '5000-10000': return '₹5k-10k';
    case '10000-15000': return '₹10k-15k';
    case '15000-20000': return '₹15k-20k';
    case '20000-30000': return '₹20k-30k';
    case '30000-999999': return '₹30k+';
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

export default function JobSeeker() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasApplications, setHasApplications] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [salaryFilter, setSalaryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [areaFilterOptions, setAreaFilterOptions] = useState([{ label: "Any", value: "" }]);
  const [jobTitleOptions, setJobTitleOptions] = useState([{ label: "Any", value: "" }]);

  const collectUniqueAreas = (sources) => {
    const names = new Set();
    if (!Array.isArray(sources)) return [];
    sources.forEach((item) => {
      const value = item?.area;
      if (value != null && String(value).trim()) {
        names.add(String(value).trim());
      }
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  };

  const collectUniqueJobTitles = (sources) => {
    const names = new Set();
    if (!Array.isArray(sources)) return [];
    sources.forEach((item) => {
      const value = item?.jobTitle;
      if (value != null && String(value).trim()) {
        names.add(String(value).trim());
      }
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  };

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      const [jobsData, storedMobile] = await Promise.all([
        getJobListings(filters),
        AsyncStorage.getItem('jobSeekerMobile')
      ]);

      setJobs(jobsData);
      setHasApplications(!!storedMobile);

      // Update filter options from fetched jobs
      const uniqueAreas = collectUniqueAreas(jobsData);
      const uniqueJobTitles = collectUniqueJobTitles(jobsData);

      setAreaFilterOptions([
        { label: "Any", value: "" },
        ...uniqueAreas.map((area) => ({ label: area, value: area })),
      ]);

      setJobTitleOptions([
        { label: "Any", value: "" },
        ...uniqueJobTitles.map((title) => ({ label: title, value: title })),
      ]);

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
          <Text style={[tps.pageTitle, { marginBottom: 0 }]}>Available Jobs</Text>
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
              type: "searchable",
              label: "Job Title",
              options: jobTitleOptions,
              value: jobTitleFilter,
              onSelect: setJobTitleFilter,
              placeholder: "Search job title...",
            },
            {
              key: "area",
              type: "searchable",
              label: "Area",
              options: areaFilterOptions,
              value: areaFilter,
              onSelect: setAreaFilter,
              placeholder: "Search area...",
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
      <View style={[propertyListStyles.selectedFiltersContainer, { marginTop: 16 }]}>
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

        <View style={{ marginTop: 16 }}>
          {hasApplications && (
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: tps.colors.primary,
                borderRadius: 8,
                marginBottom: 16,
                alignSelf: 'flex-start'
              }}
              onPress={() => navigation.navigate('JobSeekerMyApplications')}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>My Applications</Text>
            </TouchableOpacity>
          )}
          
          {!hasApplications && (
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
        </View>
        
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
