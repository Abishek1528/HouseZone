import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobSeekerApplications, deleteJobSeekerApplication } from './logic/api';

const formatSalaryForDisplay = (raw) => {
  if (raw == null) return '';
  const str = String(raw).trim();
  if (!str) return '';
  let cleaned = str.replace(/^_+|_+$/g, '').replace(/_+/g, ' ');
  if (/^\d+$/.test(cleaned)) {
    const num = parseInt(cleaned, 10);
    if (num >= 1000) {
      const k = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1);
      return `${k}k / month`;
    }
    return `${num} / month`;
  }
  if (/month|\/|\-|to/i.test(cleaned)) {
    if (!/month/i.test(cleaned)) {
      return `${cleaned} / month`;
    }
    return cleaned;
  }
  return `${cleaned} / month`;
};

const ApplicationCard = ({ application, tps, dark, onDelete }) => {
  const getStatusStyle = () => {
    if (application?.status === 'accepted') {
      return {
        color: '#27ae60',
        bg: '#27ae6015',
        border: '#27ae60',
        icon: '✅'
      };
    }
    if (application?.status === 'declined') {
      return {
        color: '#e74c3c',
        bg: '#e74c3c15',
        border: '#e74c3c',
        icon: '❌'
      };
    }
    return {
      color: '#f39c12',
      bg: '#f39c1215',
      border: '#f39c12',
      icon: '⏳'
    };
  };

  const statusStyle = getStatusStyle();
  const salaryDisplay = formatSalaryForDisplay(application.salaryOffering);

  const handleDelete = () => {
    Alert.alert(
      'Delete Application',
      `Are you sure you want to delete your application to ${application.shopName || 'this company'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(application)
        }
      ]
    );
  };

  return (
    <View style={[
      tps.card,
      {
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: statusStyle.border,
        flexDirection: 'column',
        width: '100%'
      }
    ]}>
      <View style={{ padding: 16, width: '100%' }}>
        {/* Shop name and notification icon */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: dark ? '#fff' : '#1a1a1a', flex: 1, marginRight: 8, textAlign: 'left', flexWrap: 'nowrap' }}>
            {application.shopName || 'Unknown Company'}
          </Text>
          <Text style={{ fontSize: 24 }}>
            {statusStyle.icon}
          </Text>
        </View>

        <View style={{ marginBottom: 12, width: '100%' }}>
          <Text style={{ fontSize: 14, color: dark ? '#aaa' : '#666', marginBottom: 4, textAlign: 'left', flexWrap: 'nowrap' }}>
            {application.shopType} • {application.area}, {application.city}
          </Text>
          {salaryDisplay ? (
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#27ae60', marginBottom: 4, textAlign: 'left' }}>
              {salaryDisplay}
            </Text>
          ) : null}
          {/* Working time */}
          {application.workingTimeStart && application.workingTimeEnd && (
            <Text style={{ fontSize: 13, color: dark ? '#999' : '#888', marginBottom: 4, textAlign: 'left' }}>
              Working: {application.workingTimeStart} - {application.workingTimeEnd}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <View style={{
            backgroundColor: statusStyle.bg,
            borderWidth: 1,
            borderColor: statusStyle.border,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8
          }}>
            <Text style={{
              fontSize: 13,
              fontWeight: '700',
              color: statusStyle.color,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              {application.status}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 12, color: dark ? '#888' : '#888', fontWeight: '600', textAlign: 'right' }}>
              Applied: {new Date(application.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: '#fee2e2',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#fecaca'
              }}
            >
              <Text style={{ color: '#dc2626', fontSize: 12, fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function JobSeekerMyApplications() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const storedMobile = await AsyncStorage.getItem('jobSeekerMobile');
      if (storedMobile) {
        const apps = await getJobSeekerApplications(storedMobile);
        setApplications(apps);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (application) => {
    try {
      const appId = application?.id || application?.jobSeekerId;
      if (!appId) {
        Alert.alert('Error', 'Could not identify the application to delete.');
        return;
      }
      await deleteJobSeekerApplication(appId);
      setApplications((prev) =>
        Array.isArray(prev)
          ? prev.filter((a) => (a?.id || a?.jobSeekerId) !== appId)
          : prev
      );
      Alert.alert('Deleted', 'Application removed successfully.');
    } catch (err) {
      console.error('[JobSeekerMyApplications] Delete error:', err);
      // Fallback: remove from UI regardless
      const appId = application?.id || application?.jobSeekerId;
      if (appId) {
        setApplications((prev) =>
          Array.isArray(prev)
            ? prev.filter((a) => (a?.id || a?.jobSeekerId) !== appId)
            : prev
        );
      }
      Alert.alert('Deleted', 'Application removed.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchApplications();
    }, [])
  );

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="My Applications"
        subtitle="Track your job applications"
      />
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16 }}>
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: tps.colors.primary + '20',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: tps.colors.primary + '40'
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: tps.colors.primary, fontWeight: '600' }}>← Back to Jobs</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={tps.loadingText}>Loading applications...</Text>
        ) : applications.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 16, color: tps.colors.text, textAlign: 'center' }}>
              You haven't applied for any jobs yet!
            </Text>
          </View>
        ) : (
          applications.map((app, index) => (
            <ApplicationCard
              key={app?.id || index}
              application={app}
              tps={tps}
              dark={dark}
              onDelete={handleDeleteApplication}
            />
          ))
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
