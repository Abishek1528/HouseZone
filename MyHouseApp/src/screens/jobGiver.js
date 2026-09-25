import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import { useTheme } from '../context/ThemeContext';
import { getOwnerFormThemeColors } from '../styles/ownerFormStyles';
import TenantFilterPanel from '../shared/components/TenantFilterPanel';
import { getAllJobSeekerProfiles } from './jobSeeker/logic/api';
import { getTimeAgo } from '../shared/utils/timeUtils.js';

const capitalize = (str) => {
  if (!str) return "";
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

const AGE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "18-30", value: "18-30" },
  { label: "30-50", value: "30-50" },
  { label: "50-60", value: "50-60" },
];

const GENDER_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const EDUCATION_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "10th/12th", value: "10th/12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
  { label: "Diploma", value: "diploma" },
];

const EXPERIENCE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

const SelectedFilterBox = ({ label, value, onRemove, tps }) => {
  if (!value) return null;
  const { colors } = tps;
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

const getAgeLabel = (value) => {
  if (!value) return '';
  const found = AGE_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
};

const getGenderLabel = (value) => {
  if (!value) return '';
  const found = GENDER_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
};

const getEducationLabel = (value) => {
  if (!value) return '';
  const found = EDUCATION_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : value;
};

const getExperienceLabel = (value) => {
  if (!value) return '';
  const found = EXPERIENCE_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
};

const ProfileCard = ({ profile, onViewDetails, tps, dark }) => {
  if (!profile) return null;
  const { colors } = tps;
  const isExperienced = String(profile.experienceStatus || profile.experience || '').toLowerCase() === 'experienced';
  const experienceLabel = isExperienced ? 'Experienced' : 'Fresher';
  const experienceColor = isExperienced ? '#92400e' : '#166534';
  const postedAgoText = getTimeAgo(profile.createdAt || profile.created_at);

  return (
    <View style={tps.card}>
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 120, minWidth: 120 }}>
        <View
          style={[propertyListStyles.imagePlaceholder, { justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#374151' : '#eff6ff', marginRight: 0 }]}
        >
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{ marginTop: 8, fontSize: 10, fontWeight: '500', color: colors.subText, textAlign: 'center' }}>
          Posted {postedAgoText}
        </Text>
      </View>

      <View style={propertyListStyles.detailsContainer}>
        <Text style={[propertyListStyles.location, { color: colors.text }]}>
          {profile.name || profile.fullName}
        </Text>

        {!!profile.age && (
          <Text style={{ fontSize: 13, color: colors.subText, marginTop: 2, fontWeight: '500' }}>
            {profile.age} yrs
          </Text>
        )}

        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {capitalize(profile.education)}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: experienceColor, borderTopColor: colors.border }]}>
            {experienceLabel}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
          <TouchableOpacity onPress={() => onViewDetails(profile)}>
            <Text style={[propertyListStyles.viewMoreText, { color: colors.primary, textAlign: 'right' }]}>View Details →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function JobGiver() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const themeColors = getOwnerFormThemeColors(dark);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getAllJobSeekerProfiles();
      if (Array.isArray(data)) {
        setProfiles(data);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching job seeker profiles:", error);
      Alert.alert("Error", "Failed to load profiles.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
    }, [])
  );

  useEffect(() => {
    let result = [...profiles];
    if (ageFilter) {
      const [min, max] = ageFilter.split('-').map(Number);
      result = result.filter(p => {
        const a = Number(p.age);
        return !isNaN(a) && a >= min && a <= max;
      });
    }
    if (genderFilter) {
      result = result.filter(p => String(p.gender || '').toLowerCase() === genderFilter.toLowerCase());
    }
    if (educationFilter) {
      result = result.filter(p => {
        const edu = String(p.education || '').toLowerCase();
        const filterEdu = educationFilter.toLowerCase();
        if (filterEdu === '10th/12th') {
          return edu === '10th' || edu === '12th' || edu === '10th/12th';
        }
        return edu === filterEdu;
      });
    }
    if (experienceFilter) {
      result = result.filter(p => String(p.experienceStatus || p.experience || '').toLowerCase() === experienceFilter.toLowerCase());
    }
    setFilteredProfiles(result);
  }, [profiles, ageFilter, genderFilter, educationFilter, experienceFilter]);

  const handleViewDetails = (profile) => {
    navigation.navigate('JobSeekerProfileDetails', { profileId: profile.id });
  };

  const listHeader = () => (
    <View style={propertyListStyles.content}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
        <Text style={tps.pageTitle}>Available Profiles</Text>
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
              key: "age",
              label: "Age",
              options: AGE_FILTER_OPTIONS,
              value: ageFilter,
              onSelect: setAgeFilter,
            },
            {
              key: "gender",
              label: "Gender",
              options: GENDER_FILTER_OPTIONS,
              value: genderFilter,
              onSelect: setGenderFilter,
            },
            {
              key: "education",
              label: "Education",
              options: EDUCATION_FILTER_OPTIONS,
              value: educationFilter,
              onSelect: setEducationFilter,
            },
            {
              key: "experience",
              label: "Experience",
              options: EXPERIENCE_FILTER_OPTIONS,
              value: experienceFilter,
              onSelect: setExperienceFilter,
            },
          ]}
        />
      )}

      <View style={[propertyListStyles.selectedFiltersContainer, { marginTop: 8 }]}>
        <SelectedFilterBox label="Age" value={getAgeLabel(ageFilter)} onRemove={() => setAgeFilter("")} tps={tps} />
        <SelectedFilterBox label="Gender" value={getGenderLabel(genderFilter)} onRemove={() => setGenderFilter("")} tps={tps} />
        <SelectedFilterBox label="Education" value={getEducationLabel(educationFilter)} onRemove={() => setEducationFilter("")} tps={tps} />
        <SelectedFilterBox label="Experience" value={getExperienceLabel(experienceFilter)} onRemove={() => setExperienceFilter("")} tps={tps} />
      </View>

      <View style={{ marginBottom: 10, marginTop: 12 }}>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          {loading ? 'Loading...' : `${filteredProfiles.length} found`}
        </Text>
      </View>

      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading profiles...</Text>
        </View>
      ) : filteredProfiles.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={propertyListStyles.noPropertiesText}>No profiles yet</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            Profiles will appear here once job seekers add their profile.
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <TenantPageHeader
        title="Job Givers"
        subtitle="Post jobs for your local shop and find workers nearby."
      />
      <View style={[categoryContentStyles.content, { flex: 1, justifyContent: 'flex-start', paddingBottom: 0, flexDirection: 'column', paddingTop: 0 }]}>

        <View style={{ flex: 1, width: '100%' }}>
          <FlatList
            data={filteredProfiles}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ProfileCard profile={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />
            )}
            style={propertyListStyles.list}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={[categoryContentStyles.buttonRow, { marginBottom: 24, marginTop: 8, width: '100%' }]}>
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={() => navigation.navigate("AddJobGiver")}
          >
            <Text style={categoryContentStyles.buttonText}>Register Your Company</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.secondaryButton]}
            onPress={() => navigation.navigate("JobGiverJobSeekers")}
          >
            <Text style={categoryContentStyles.buttonText}>My Applicants</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}
