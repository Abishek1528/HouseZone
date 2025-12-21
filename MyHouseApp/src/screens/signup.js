import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import signupStyles from '../styles/signupStyles';
import categoryContentStyles from '../styles/categoryContentStyles';

// Use the same API configuration as other parts of the app
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    // Basic validation
    if (!name || !age || !contact || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      console.log(`Attempting to signup with API URL: ${API_BASE_URL}/signup`);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age: parseInt(age),
          contact,
          email,
          password
        }),
      });

      console.log(`Response status: ${response.status}`);
      
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        Alert.alert("Success", "User registered successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Error", result.message || `Signup failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      
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
    <View style={signupStyles.container}>
      <View style={{ flex: 1, justifyContent: 'center', width: '100%', maxWidth: 400, paddingHorizontal: 20 }}>
        <View style={categoryContentStyles.formContainer}>
          <Text style={categoryContentStyles.formTitle}>Signup</Text>
          <Text style={categoryContentStyles.label}>Name</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Name"
            placeholderTextColor="#999999"
            value={name}
            onChangeText={setName}
          />
          <Text style={categoryContentStyles.label}>Age</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Age"
            placeholderTextColor="#999999"
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
          />
          <Text style={categoryContentStyles.label}>Contact Number</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Contact Number"
            placeholderTextColor="#999999"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
          <Text style={categoryContentStyles.label}>Email</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Email"
            placeholderTextColor="#999999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={categoryContentStyles.label}>Password</Text>
          <TextInput
            style={categoryContentStyles.input}
            placeholder="Password"
            placeholderTextColor="#999999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleSignup}
          >
            <Text style={categoryContentStyles.buttonText}>Signup</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 15, flexDirection: "row", justifyContent: 'center' }}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "blue" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}