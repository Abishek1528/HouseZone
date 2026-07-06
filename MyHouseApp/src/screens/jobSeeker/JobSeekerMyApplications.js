import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobSeekerApplications } from './logic/api';

const ApplicationCard = ({ application, tps, dark }) => {
  const getStatusStyle = () => {
    if (application?.status === 'accepted') {
      return {
        color: '#27ae60',
        bg: '#27ae6015',
        border: '#27ae60'
      };
    }
    if (application?.status === 'declined') {
      return {
        color: '#e74c3c',
        bg: '#e74c3c15',
        border: '#e74c3c'
      };
    }
    return {
      color: '#f39c12',
      bg: '#f39c1215',
      border: '#f39c12'
    };
  };

  const statusStyle = getStatusStyle();

  return (
    <View style={[tps.card, { marginBottom: 16, borderLeftWidth: 4, borderLeftColor: statusStyle.border }]}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: dark ? '#fff' : '#1a1a1a' }}>
          {application.shopName || 'Unknown Company'}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 14, color: dark ? '#aaa' : '#666', marginBottom: 4 }}>
              {application.shopType} • {application.area}, {application.city}
            </Text>
            {application.salaryOffering && (
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#27ae60' }}>
                ₹{application.salaryOffering}/month
              </Text>
            )}
          </View>
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
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: dark ? '#888' : '#888', fontWeight: '600' }}>
            Applied: {new Date(application.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Text>
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
            <ApplicationCard key={index} application={app} tps={tps} dark={dark} />
          ))
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
