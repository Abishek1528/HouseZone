import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";

// Use the same API configuration as other parts of the app
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSignups(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching signups:", error);
      Alert.alert("Error", "Failed to fetch signup details: " + error.message);
      setLoading(false);
      setSignups([]); // Set empty array instead of mock data
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <ScrollView contentContainerStyle={adminStyles.dashboardContainerCentered}>
      <View style={adminStyles.dashboardContentContainer}>
        <Text style={adminStyles.dashboardTitle}>Today's Signups</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#800080" style={{ marginVertical: 20 }} />
        ) : signups.length === 0 ? (
          <Text style={adminStyles.dashboardContent}>No signups found for today.</Text>
        ) : (
          <View style={{ width: '100%', paddingHorizontal: 20 }}>
            {signups.map((signup) => (
              <View key={signup.id} style={{
                backgroundColor: '#f0f0f0',
                padding: 15,
                borderRadius: 8,
                marginBottom: 10,
                borderLeftWidth: 4,
                borderLeftColor: '#800080'
              }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{signup.name}</Text>
                <Text style={{ fontSize: 16, marginBottom: 3 }}>Age: {signup.age}</Text>
                <Text style={{ fontSize: 16, marginBottom: 3 }}>Email: {signup.email}</Text>
                <Text style={{ fontSize: 16, marginBottom: 3 }}>Contact: {signup.contact_number}</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Signed up: {formatDate(signup.created_at)}</Text>
              </View>
            ))}
          </View>
        )}
        
   
      </View>
    </ScrollView>
  );
}