import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import adminStyles, { ADMIN_COLORS } from "../../styles/admin/adminStyles";
import AdminPageHeader from "../../shared/components/AdminPageHeader";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export default function SignupPage() {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysSignups();
  }, []);

  const fetchTodaysSignups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/signups/today`);
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      setSignups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching signups:", error);
      Alert.alert("Error", "Failed to fetch signup details: " + error.message);
      setSignups([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <View style={adminStyles.screen}>
      <AdminPageHeader title="Today's Signups" subtitle="New user registrations from today" />
      <ScrollView style={adminStyles.body} contentContainerStyle={adminStyles.scrollContent}>
        {loading ? (
          <View style={adminStyles.loadingWrap}>
            <ActivityIndicator size="large" color={ADMIN_COLORS.primary} />
          </View>
        ) : signups.length === 0 ? (
          <Text style={adminStyles.noDataText}>No signups found for today.</Text>
        ) : (
          signups.map((signup) => (
            <View key={signup.id} style={adminStyles.signupCard}>
              <Text style={adminStyles.signupName}>{signup.name}</Text>
              <Text style={adminStyles.signupLine}>Age: {signup.age}</Text>
              <Text style={adminStyles.signupLine}>Email: {signup.email}</Text>
              <Text style={adminStyles.signupLine}>Contact: {signup.contact_number}</Text>
              <Text style={adminStyles.signupMeta}>Signed up: {formatDate(signup.created_at)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
