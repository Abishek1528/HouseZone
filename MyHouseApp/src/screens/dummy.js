import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Animated, Easing, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dummyStyles from '../styles/dummyStyles';
import adminModalStyles from '../styles/admin/adminModalStyles';

export default function Dummy() {
  const navigation = useNavigation();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const hardcodedPassword = "admin123";

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

  const handleAdminLogin = () => {
    if (adminPassword === hardcodedPassword) {
      setShowAdminModal(false);
      setAdminPassword("");
      navigation.navigate("AdminDashboard");
    } else {
      Alert.alert("Error", "Incorrect password. Please try again.");
    }
  };

  return (
    <View style={dummyStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      
      <View style={dummyStyles.headerSection}>
        <Animated.View style={{ opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }}>
          <Text style={dummyStyles.headerTitle}>Welcome to</Text>
          <Text style={dummyStyles.headerBrand}>HouseZone</Text>
          <View style={{ marginTop: 30 }}>
            <Text style={dummyStyles.mainTagline}>
              One Platform for All Your Rental Needs
            </Text>
            
            <Text style={dummyStyles.description}>
              Discover homes, vehicles, furniture, equipment, and more — all from one secure and easy-to-use rental platform.
            </Text>
            
            <Text style={dummyStyles.featuresTitle}>
              Feature Highlights
            </Text>
            
            <View style={dummyStyles.featuresGrid}>
              <View style={dummyStyles.featuresGridColumn}>
                <View style={dummyStyles.featuresListItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#2563eb" style={{ marginRight: 8 }} />
                  <Text style={dummyStyles.featuresListItemText}>Trusted Listings</Text>
                </View>
                
                <View style={dummyStyles.featuresListItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" style={{ marginRight: 8 }} />
                  <Text style={dummyStyles.featuresListItemText}>Instant Booking</Text>
                </View>
              </View>
              
              <View style={dummyStyles.featuresGridColumn}>
                <View style={dummyStyles.featuresListItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#f59e0b" style={{ marginRight: 8 }} />
                  <Text style={dummyStyles.featuresListItemText}>Secure Payments</Text>
                </View>
                
                <View style={dummyStyles.featuresListItem}>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#8b5cf6" style={{ marginRight: 8 }} />
                  <Text style={dummyStyles.featuresListItemText}>24/7 Accessibility</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
      
      <Animated.View 
        style={[dummyStyles.contentSection, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}
      >
        <View style={dummyStyles.formCard}>
          <Text style={dummyStyles.welcomeText}>Get Started Today</Text>
          <Text style={dummyStyles.subText}>Create an account or log in to begin your journey</Text>

          <TouchableOpacity
            style={dummyStyles.button}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={dummyStyles.btnText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dummyStyles.button, dummyStyles.adminButton]}
            onPress={() => setShowAdminModal(true)}
          >
            <Text style={dummyStyles.adminBtnText}>Admin Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAdminModal}
        onRequestClose={() => setShowAdminModal(false)}
      >
        <View style={adminModalStyles.centeredView}>
          <View style={adminModalStyles.modalView}>
            <Text style={adminModalStyles.title}>Admin Login</Text>
            
            <View style={adminModalStyles.passwordContainer}>
              <TextInput
                style={adminModalStyles.passwordInput}
                placeholder="Enter admin password"
                secureTextEntry={!showPassword}
                value={adminPassword}
                onChangeText={setAdminPassword}
              />
              <TouchableOpacity 
                style={adminModalStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialCommunityIcons 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={adminModalStyles.buttonContainer}>
              <TouchableOpacity
                style={adminModalStyles.loginButton}
                onPress={handleAdminLogin}
              >
                <Text style={adminModalStyles.buttonText}>Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={adminModalStyles.cancelButton}
                onPress={() => {
                  setShowAdminModal(false);
                  setAdminPassword("");
                }}
              >
                <Text style={adminModalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
