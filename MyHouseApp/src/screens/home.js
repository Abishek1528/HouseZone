import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import homeContentStyles from '../styles/homeContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setSelectedRole(""); // Reset role selection
    setModalVisible(true); // Show dropdown modal
  };

  const handleRoleSelection = () => {
    if (!selectedRole) {
      Alert.alert("Selection Required", "Please select a role");
      return;
    }
    
    setModalVisible(false);
    // Navigate to the specific category page with role information
    navigation.navigate(selectedCategory, { role: selectedRole });
  };

  const roles = ["Tenant", "Owner"];

  return (
    <View style={[homeContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />

      {/* BUTTONS */}
      <View style={homeContentStyles.middle}>
        <View style={homeContentStyles.row}>
          <Text style={[homeContentStyles.pageTitle, { color: colors.text }]}>Categories</Text>
        </View>
        
        <View style={homeContentStyles.row}>
          <TouchableOpacity 
            style={[homeContentStyles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleCategoryPress("Residential")}
          >
            <Text style={[homeContentStyles.btnText, { color: colors.text }]}>Residential</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[homeContentStyles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleCategoryPress("Business")}
          >
            <Text style={[homeContentStyles.btnText, { color: colors.text }]}>Business</Text>
          </TouchableOpacity>
        </View>

        <View style={homeContentStyles.row}>
          <TouchableOpacity 
            style={[homeContentStyles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleCategoryPress("Vehicles")}
          >
            <Text style={[homeContentStyles.btnText, { color: colors.text }]}>Vehicles</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[homeContentStyles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleCategoryPress("Machinery")}
          >
            <Text style={[homeContentStyles.btnText, { color: colors.text }]}>Machinery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={homeContentStyles.modalContainer}>
          <View style={[homeContentStyles.modalView, { backgroundColor: colors.background }]}>
            <Text style={[homeContentStyles.modalTitle, { color: colors.text }]}>Select Your Role</Text>
            <Text style={[homeContentStyles.modalText, { color: colors.subText }]}>Category: {selectedCategory}</Text>
            
            <TouchableOpacity 
              style={[homeContentStyles.dropdown, { borderColor: colors.border }]}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={[homeContentStyles.dropdownText, { color: colors.text }]}>
                {selectedRole || "Select a role"}
              </Text>
              <Text style={[homeContentStyles.arrow, { color: colors.text }]}>{dropdownVisible ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={[homeContentStyles.dropdownList, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={homeContentStyles.dropdownItem}
                    onPress={() => {
                      setSelectedRole(role);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[homeContentStyles.dropdownItemText, { color: colors.text }]}>{role}</Text>
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
                style={[homeContentStyles.modalButton, homeContentStyles.submitButton, { backgroundColor: colors.primary }]}
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