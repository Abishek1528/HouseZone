import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Alert, Animated, Easing, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import homeContentStyles from '../styles/homeContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(30)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;
  const slideAnim3 = useRef(new Animated.Value(30)).current;

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
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 1200,
        delay: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim3, {
        toValue: 0,
        duration: 1200,
        delay: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setSelectedRole("");
    setModalVisible(true);
  };

  const handleRoleSelection = () => {
    if (!selectedRole) {
      Alert.alert("Selection Required", "Please select a role");
      return;
    }
    
    setModalVisible(false);
    navigation.navigate(selectedCategory, { role: selectedRole });
  };

  const roles = ["Tenant", "Owner"];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Residential':
        return 'home-city';
      case 'Business':
        return 'office-building';
      case 'Vehicles':
        return 'car';
      case 'Machinery':
        return 'cog';
      default:
        return 'cube';
    }
  };

  return (
    <View style={homeContentStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      
      <View style={homeContentStyles.headerSection}>
        <Animated.View style={{ opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }}>
          <Text style={homeContentStyles.headerTitle}>HouseZone</Text>
          <Text style={homeContentStyles.headerSubtitle}>Choose a category to get started</Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }], marginTop: 20 }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff' }}>Explore Categories</Text>
        </Animated.View>
      </View>

      <View style={homeContentStyles.middle}>
        
        <Animated.View style={{ opacity: fadeAnim3, transform: [{ translateY: slideAnim3 }] }}>
          <View style={homeContentStyles.row}>
            <TouchableOpacity 
              style={homeContentStyles.button}
              onPress={() => handleCategoryPress("Residential")}
            >
              <View style={{ 
                backgroundColor: '#E8F0FE', 
                width: 75, 
                height: 75, 
                borderRadius: 22, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <MaterialCommunityIcons name="home-city" size={42} color="#1e3a5f" />
              </View>
              <Text style={homeContentStyles.btnText}>Residential</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeContentStyles.button}
              onPress={() => handleCategoryPress("Business")}
            >
              <View style={{ 
                backgroundColor: '#E3F2FD', 
                width: 75, 
                height: 75, 
                borderRadius: 22, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <MaterialCommunityIcons name="office-building" size={42} color="#4A90E2" />
              </View>
              <Text style={homeContentStyles.btnText}>Business</Text>
            </TouchableOpacity>
          </View>

          <View style={homeContentStyles.row}>
            <TouchableOpacity 
              style={homeContentStyles.button}
              onPress={() => handleCategoryPress("Vehicles")}
            >
              <View style={{ 
                backgroundColor: '#E6F0F8', 
                width: 75, 
                height: 75, 
                borderRadius: 22, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <MaterialCommunityIcons name="car" size={42} color="#2563eb" />
              </View>
              <Text style={homeContentStyles.btnText}>Vehicles</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeContentStyles.button}
              onPress={() => handleCategoryPress("Machinery")}
            >
              <View style={{ 
                backgroundColor: '#EEF2F8', 
                width: 75, 
                height: 75, 
                borderRadius: 22, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <MaterialCommunityIcons name="cog" size={42} color="#64748b" />
              </View>
              <Text style={homeContentStyles.btnText}>Machinery</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={homeContentStyles.modalContainer}>
          <View style={homeContentStyles.modalView}>
            <Text style={homeContentStyles.modalTitle}>Select Your Role</Text>
            <Text style={homeContentStyles.modalText}>Category: {selectedCategory}</Text>
            
            <TouchableOpacity 
              style={homeContentStyles.dropdown}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={homeContentStyles.dropdownText}>
                {selectedRole || "Select a role"}
              </Text>
              <Text style={homeContentStyles.arrow}>{dropdownVisible ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={homeContentStyles.dropdownList}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={homeContentStyles.dropdownItem}
                    onPress={() => {
                      setSelectedRole(role);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={homeContentStyles.dropdownItemText}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <View style={homeContentStyles.modalButtonContainer}>
              <TouchableOpacity
                style={[homeContentStyles.modalButton, homeContentStyles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={homeContentStyles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[homeContentStyles.modalButton, homeContentStyles.submitButton]}
                onPress={handleRoleSelection}
              >
                <Text style={homeContentStyles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}
