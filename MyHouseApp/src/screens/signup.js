import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import signupStyles from '../styles/signupStyles';
import { sanitizePhoneInput } from '../shared/utils/phoneInput';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!name || !age || !contact || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Attempting to signup with API URL: ${API_BASE_URL}/signup`);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age: parseInt(age) || 0,
          contact,
          email,
          password
        }),
      });

      console.log(`Response status: ${response.status}`);
      
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { message: text };
      }
      
      console.log('Response data:', result);

      if (response.ok) {
        const userDetails = {
          name,
          age,
          contact,
          email
        };
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

        Alert.alert("Success", "User registered successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Error", result.message || `Signup failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = "Failed to connect to server. ";
      
      if (error.message && error.message.includes('Network request failed')) {
        errorMessage += "Network error detected. This usually means the API URL is incorrect for your current network. \n\n" +
                       "Please check: \n" +
                       "1. If the backend server is running (npm start in backend folder)\n" +
                       `2. If your machine's IP address has changed. Current configured URL: ${API_BASE_URL}\n` +
                       "3. If your phone and computer are on the same Wi-Fi network\n\n" +
                       "To fix this, find your computer's IP address (ipconfig) and update EXPO_PUBLIC_API_URL in your .env file.";
      } else {
        errorMessage += `Error: ${error.message || error}`;
      }
      
      Alert.alert("Connection Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={signupStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      
      <View style={signupStyles.headerSection}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: '900', 
          color: '#fff', 
          marginBottom: 3,
          letterSpacing: -0.5,
          marginTop: 10,
        }}>
          Join the future of
        </Text>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: '900', 
          color: '#fff', 
          marginBottom: 20,
          letterSpacing: -0.5,
        }}>
          renting.
        </Text>
        <View style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: 15, 
          borderRadius: 15,
          borderLeftWidth: 4,
          borderLeftColor: '#fff',
        }}>
          <Text style={{ 
            fontSize: 16, 
            color: '#e2e8f0', 
            lineHeight: 26,
            fontWeight: '500',
          }}>
            A unified platform for all your rental needs. Safe. Simple. Seamless.
          </Text>
        </View>
      </View>
      
      <ScrollView 
        style={signupStyles.contentSection} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
      >
        <View style={signupStyles.formCard}>
          <Text style={signupStyles.formCardTitle}>Create Free Account</Text>
          
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>Name</Text>
            <TextInput
              style={signupStyles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>Age</Text>
            <TextInput
              style={signupStyles.input}
              placeholder="Age"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
          </View>
          
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>Contact Number</Text>
            <TextInput
              style={signupStyles.input}
              placeholder="Contact Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={(value) => setContact(sanitizePhoneInput(value))}
              maxLength={10}
            />
          </View>
          
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>Email</Text>
            <TextInput
              style={signupStyles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>Password</Text>
            <View style={signupStyles.passwordContainer}>
              <TextInput
                style={signupStyles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={signupStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={22} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={signupStyles.signupButton} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={signupStyles.signupButtonText}>Signup</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={signupStyles.loginLinkContainer}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={signupStyles.loginLinkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
