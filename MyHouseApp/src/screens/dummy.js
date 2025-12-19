import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import dummyStyles from '../styles/dummyStyles';
import adminModalStyles from '../styles/adminModalStyles';

export default function Dummy() {
  const navigation = useNavigation();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const hardcodedPassword = "admin123"; // Hardcoded password

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
      <Text style={dummyStyles.title}>Welcome to HouseZone</Text>

      <TouchableOpacity
        style={dummyStyles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={dummyStyles.btnText}>Get Started</Text>
      </TouchableOpacity>

      {/* Admin button added below Get Started */}
      <TouchableOpacity
        style={[dummyStyles.button, dummyStyles.adminButton]}
        onPress={() => setShowAdminModal(true)}
      >
        <Text style={dummyStyles.btnText}>For Admin Use</Text>
      </TouchableOpacity>

      {/* Admin Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAdminModal}
        onRequestClose={() => setShowAdminModal(false)}
      >
        <View style={adminModalStyles.centeredView}>
          <View style={adminModalStyles.modalView}>
            <Text style={adminModalStyles.title}>Admin Login</Text>
            
            <TextInput
              style={adminModalStyles.input}
              placeholder="Enter admin password"
              secureTextEntry={true}
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
            
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