import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Animated, Easing, StatusBar, ScrollView } from "react-native";
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
        <Animated.View style={{ opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }], marginTop: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>Explore Categories</Text>
        </Animated.View>
      </View>

      <View style={homeContentStyles.middle}>
        
        <Animated.View style={{ opacity: fadeAnim3, transform: [{ translateY: slideAnim3 }], paddingBottom: 10 }}>
          <Text style={homeContentStyles.sectionTitle}>Rental</Text>
          
          <View style={homeContentStyles.row}>
            <TouchableOpacity 
              style={[homeContentStyles.button, { 
                backgroundColor: '#FFF5F5', 
                borderColor: '#FCA5A5', 
                borderWidth: 2 
              }]}
              onPress={() => handleCategoryPress("Residential")}
            >
              <View style={{ 
                backgroundColor: '#FCA5A5', 
                width: 55, 
                height: 55, 
                borderRadius: 16, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <MaterialCommunityIcons name="home-city" size={32} color="#7F1D1D" />
              </View>
              <Text style={[homeContentStyles.btnText, { color: '#7F1D1D', fontWeight: '800' }]}>Residential</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[homeContentStyles.button, { 
                backgroundColor: '#EFF6FF', 
                borderColor: '#93C5FD', 
                borderWidth: 2 
              }]}
              onPress={() => handleCategoryPress("Business")}
            >
              <View style={{ 
                backgroundColor: '#93C5FD', 
                width: 55, 
                height: 55, 
                borderRadius: 16, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <MaterialCommunityIcons name="office-building" size={32} color="#1E40AF" />
              </View>
              <Text style={[homeContentStyles.btnText, { color: '#1E40AF', fontWeight: '800' }]}>Business</Text>
            </TouchableOpacity>
          </View>

          <View style={homeContentStyles.row}>
            <TouchableOpacity 
              style={[homeContentStyles.button, { 
                backgroundColor: '#F0FDF4', 
                borderColor: '#86EFAC', 
                borderWidth: 2 
              }]}
              onPress={() => handleCategoryPress("Vehicles")}
            >
              <View style={{ 
                backgroundColor: '#86EFAC', 
                width: 55, 
                height: 55, 
                borderRadius: 16, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <MaterialCommunityIcons name="car" size={32} color="#166534" />
              </View>
              <Text style={[homeContentStyles.btnText, { color: '#166534', fontWeight: '800' }]}>Vehicles</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[homeContentStyles.button, { 
                backgroundColor: '#FFF7ED', 
                borderColor: '#FDBA74', 
                borderWidth: 2 
              }]}
              onPress={() => handleCategoryPress("Machinery")}
            >
              <View style={{ 
                backgroundColor: '#FDBA74', 
                width: 55, 
                height: 55, 
                borderRadius: 16, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <MaterialCommunityIcons name="cog" size={32} color="#92400E" />
              </View>
              <Text style={[homeContentStyles.btnText, { color: '#92400E', fontWeight: '800' }]}>Machinery</Text>
            </TouchableOpacity>
          </View>

          <Text style={homeContentStyles.sectionTitle}>Job</Text>

          <View style={homeContentStyles.row}>
            <TouchableOpacity
              style={[homeContentStyles.button, { 
                backgroundColor: '#FAF5FF', 
                borderColor: '#D8B4FE', 
                borderWidth: 2 
              }]}
              onPress={() => handleCategoryPress("JobSeeker")}
            >
              <View style={{
                backgroundColor: '#D8B4FE',
                width: 55,
                height: 55,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <MaterialCommunityIcons name="account-search" size={32} color="#6B21A8" />
              </View>
              <Text style={[homeContentStyles.btnText, { color: '#6B21A8', fontWeight: '800' }]}>Job Seeker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[homeContentStyles.button, { 
                backgroundColor: '#ECFEFF', 
                borderColor: '#99F6E4', 
                borderWidth: 2 
              }]}
              onPress={() => handleCategoryPress("JobGiver")}
            >
              <View style={{
                backgroundColor: '#99F6E4',
                width: 55,
                height: 55,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <MaterialCommunityIcons name="briefcase-plus" size={32} color="#0F766E" />
              </View>
              <Text style={[homeContentStyles.btnText, { color: '#0F766E', fontWeight: '800' }]}>Job Giver</Text>
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
