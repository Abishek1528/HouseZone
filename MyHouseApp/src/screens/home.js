import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import homeContentStyles from '../styles/homeContentStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const navigation = useNavigation();
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
      alert("Please select a role");
      return;
    }
    
    setModalVisible(false);
    // Navigate to the specific category page with role information
    navigation.navigate(selectedCategory, { role: selectedRole });
  };

  const roles = ["Tenant", "Owner"];

  return (
    <View style={homeContentStyles.container}>
      <Header />

      {/* BUTTONS */}
      <View style={homeContentStyles.middle}>
        <View style={homeContentStyles.row}>
          <Text style={homeContentStyles.pageTitle}>Categories</Text>
        </View>
        
        <View style={homeContentStyles.row}>
          <TouchableOpacity 
            style={homeContentStyles.button}
            onPress={() => handleCategoryPress("Residential")}
          >
            <Text style={homeContentStyles.btnText}>Residential</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={homeContentStyles.button}
            onPress={() => handleCategoryPress("Business")}
          >
            <Text style={homeContentStyles.btnText}>Business</Text>
          </TouchableOpacity>
        </View>

        <View style={homeContentStyles.row}>
          <TouchableOpacity 
            style={homeContentStyles.button}
            onPress={() => handleCategoryPress("Vehicles")}
          >
            <Text style={homeContentStyles.btnText}>Vehicles</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={homeContentStyles.button}
            onPress={() => handleCategoryPress("Machinery")}
          >
            <Text style={homeContentStyles.btnText}>Machinery</Text>
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