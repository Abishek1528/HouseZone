import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Animated, Easing, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import homeContentStyles from '../styles/homeContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    const directRoutes = {
      JobSeeker: "JobSeeker",
      JobGiver: "JobGiver",
    };

    if (directRoutes[category]) {
      navigation.navigate(directRoutes[category]);
      return;
    }

    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleRolePress = (role) => {
    if (!selectedCategory) return;

    setModalVisible(false);

    const routes = {
      Residential: {
        Tenant: { screen: "PropertiesList" },
        Owner: { screen: "AddHouse", params: { role: "Owner" } },
      },
      Business: {
        Tenant: { screen: "BusinessPropertiesList" },
        Owner: { screen: "AddBusiness", params: { role: "Owner" } },
      },
      Vehicles: {
        Tenant: { screen: "VehiclesList" },
        Owner: { screen: "AddVehicles", params: { role: "Owner" } },
      },
      Machinery: {
        Tenant: { screen: "MachineryListPage" },
        Owner: { screen: "AddMachinery", params: { role: "Owner" } },
      },
    };

    const destination = routes[selectedCategory]?.[role];
    if (destination) {
      navigation.navigate(destination.screen, destination.params);
    }
  };

  const roles = [
    { label: "Owner", value: "Owner" },
    { label: "Tenant", value: "Tenant" },
  ];

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

          <View style={homeContentStyles.row}>
            <TouchableOpacity
              style={homeContentStyles.button}
              onPress={() => handleCategoryPress("JobSeeker")}
            >
              <View style={{
                backgroundColor: '#F3E8FF',
                width: 75,
                height: 75,
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <MaterialCommunityIcons name="account-search" size={42} color="#7c3aed" />
              </View>
              <Text style={homeContentStyles.btnText}>Job Seeker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={homeContentStyles.button}
              onPress={() => handleCategoryPress("JobGiver")}
            >
              <View style={{
                backgroundColor: '#ECFDF5',
                width: 75,
                height: 75,
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <MaterialCommunityIcons name="briefcase-plus" size={42} color="#059669" />
              </View>
              <Text style={homeContentStyles.btnText}>Job Givers</Text>
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
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={homeContentStyles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={homeContentStyles.modalView}>
                <Text style={homeContentStyles.modalTitle}>Select Your Role</Text>
                <Text style={homeContentStyles.modalText}>Category: {selectedCategory}</Text>

                <View style={homeContentStyles.roleRow}>
                  {roles.map((role, index) => (
                    <TouchableOpacity
                      key={role.value}
                      style={[
                        homeContentStyles.roleBtn,
                        index === 0 ? homeContentStyles.roleBtnOwner : homeContentStyles.roleBtnTenant,
                      ]}
                      onPress={() => handleRolePress(role.value)}
                      activeOpacity={0.85}
                    >
                      <Text style={homeContentStyles.roleBtnText}>{role.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Footer />
    </View>
  );
}
