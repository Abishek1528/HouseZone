import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import loginStyles from '../styles/loginStyles';
import categoryContentStyles from '../styles/categoryContentStyles';

// Use the same API configuration as other parts of the app
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Basic validation
    if (!name || !phone || !password) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    try {
      console.log(`Attempting to login with API URL: ${API_BASE_URL}/login`);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          contact: phone,
          password
        }),
      });

      console.log(`Response status: ${response.status}`);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Login Error", result.message || `Login failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // More detailed error handling
      let errorMessage = "Failed to connect to server. ";
      
      if (error.message && error.message.includes('network')) {
        errorMessage += "Network error detected. Please check: \n\n" +
                       "1. If the backend server is running on port 3000\n" +
                       `2. If you're using the correct protocol (should be http:// not https://)\n` +
                       `3. If the API URL is correct: ${API_BASE_URL}\n` +
                       "4. If your firewall is blocking the connection\n\n" +
                       `Technical error: ${error.message}`;
      } else {
        errorMessage += `Error: ${error.message || error}`;
      }
      
      Alert.alert("Connection Error", errorMessage);
    }
  };

  return (
    <View style={loginStyles.container}>
      <View style={{ flex: 1, justifyContent: 'center', width: '100%', maxWidth: 400, paddingHorizontal: 20 }}>
        <View style={categoryContentStyles.formContainer}>
          <Text style={categoryContentStyles.formTitle}>Login</Text>
          <Text style={categoryContentStyles.label}>Name</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <Text style={categoryContentStyles.label}>Phone Number</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Text style={categoryContentStyles.label}>Password</Text>  
          <View style={categoryContentStyles.passwordContainer}>
            <TextInput
              style={categoryContentStyles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={categoryContentStyles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons 
                name={showPassword ? "eye" : "eye-off"} 
                size={24} 
                color="#4A90E2" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleLogin}
          >
            <Text style={categoryContentStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 15, flexDirection: "row", justifyContent: 'center' }}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={{ color: "blue" }}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}