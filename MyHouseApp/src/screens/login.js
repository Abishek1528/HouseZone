import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, Animated, Easing, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginStyles from '../styles/loginStyles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(30)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 800,
        delay: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim1, {
        toValue: 0,
        duration: 800,
        delay: 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim2, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
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
        const userDetails = result.user || {
          name,
          contact: phone
        };
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert("Login Error", result.message || `Login failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      
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
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={loginStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      
      <View style={loginStyles.headerSection}>
        <Animated.View style={{ opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }}>
          <Text style={loginStyles.headerTitle}>Hello</Text>
          <Text style={loginStyles.headerSubtitle}>Welcome Back!</Text>
          <View style={{ marginTop: 30 }}>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: '900', 
              color: '#fff', 
              marginBottom: 10,
              letterSpacing: -0.5,
            }}>
              Rent Smarter. Live Easier.
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
                Login to continue exploring rentals near you.
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
      
      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        onTouchStart={() => Keyboard.dismiss()}
      >
        <Animated.View 
          style={[loginStyles.contentSection, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}
        >
        <View style={loginStyles.formCard}>
          <Text style={loginStyles.formCardTitle}>Login Account</Text>
          
          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.label}>Name</Text>
            <TextInput
              style={loginStyles.input}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.label}>Phone Number</Text>
            <TextInput
              style={loginStyles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          
          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.label}>Password</Text>
            <View style={loginStyles.passwordContainer}>
              <TextInput
                style={loginStyles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={loginStyles.eyeIcon}
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
          
          <View style={{ alignItems: 'flex-end', marginBottom: 20, marginTop: 5 }}>
            <TouchableOpacity>
              <Text style={loginStyles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={loginStyles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={loginStyles.loginButtonText}>Login Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={loginStyles.signupLinkContainer}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={loginStyles.signupLinkText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
