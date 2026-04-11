import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImageView from "react-native-image-viewing";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import categoryContentStyles from '../styles/categoryContentStyles';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(route.params?.isEditing || false);
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    age: '',
    contact: '',
    email: ''
  });

  useEffect(() => {
    if (route.params?.isEditing !== undefined) {
      setIsEditing(route.params.isEditing);
    }
  }, [route.params?.isEditing]);

  useEffect(() => {
    loadUserDetails();
    loadProfileImage();
  }, []);

  const loadUserDetails = async () => {
    try {
      const storedDetails = await AsyncStorage.getItem('userDetails');
      if (storedDetails) {
        const details = JSON.parse(storedDetails);
        setUserDetails(details);
        setEditedDetails({
          name: details.name || '',
          age: details.age?.toString() || '',
          contact: details.contact || details.contact_number || '',
          email: details.email || ''
        });
      } else {
        Alert.alert("Error", "User details not found. Please log in.", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const saveProfileChanges = async () => {
    try {
      const updatedDetails = {
        ...userDetails,
        ...editedDetails,
        age: parseInt(editedDetails.age) || userDetails.age
      };
      await AsyncStorage.setItem('userDetails', JSON.stringify(updatedDetails));
      setUserDetails(updatedDetails);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert("Error", "Failed to save profile changes.");
    }
  };

  const loadProfileImage = async () => {
    try {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem('profileImage', uri);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userDetails');
      Alert.alert("Success", "Logged out successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[categoryContentStyles.container, { backgroundColor: colors.background }]}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity 
              onPress={() => {
                if (profileImage) setIsImageViewVisible(true);
                else pickImage();
              }} 
              style={[styles.avatarContainer, { borderColor: colors.primary }]}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {profileImage && (
            <ImageView
              images={[{ uri: profileImage }]}
              imageIndex={0}
              visible={isImageViewVisible}
              onRequestClose={() => setIsImageViewVisible(false)}
            />
          )}
          
          <Text style={[styles.userName, { color: colors.text }]}>{userDetails?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: colors.subText }]}>{userDetails?.email || ''}</Text>
          
          {!isEditing && (
            <TouchableOpacity 
              style={[styles.editProfileBtn, { backgroundColor: colors.primary }]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, borderBottomColor: colors.primary }]}>Personal Information</Text>
          
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.subText} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, { color: colors.text, borderBottomColor: colors.primary }]}
                  value={editedDetails.name}
                  onChangeText={(val) => setEditedDetails({...editedDetails, name: val})}
                />
              ) : (
                <Text style={[styles.infoValue, { color: colors.text }]}>{userDetails?.name || 'Not provided'}</Text>
              )}
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={20} color={colors.subText} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Age</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, { color: colors.text, borderBottomColor: colors.primary }]}
                  value={editedDetails.age}
                  keyboardType="numeric"
                  onChangeText={(val) => setEditedDetails({...editedDetails, age: val})}
                />
              ) : (
                <Text style={[styles.infoValue, { color: colors.text }]}>{userDetails?.age || 'Not provided'}</Text>
              )}
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="call-outline" size={20} color={colors.subText} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, { color: colors.text, borderBottomColor: colors.primary }]}
                  value={editedDetails.contact}
                  keyboardType="phone-pad"
                  onChangeText={(val) => setEditedDetails({...editedDetails, contact: val})}
                />
              ) : (
                <Text style={[styles.infoValue, { color: colors.text }]}>{userDetails?.contact || userDetails?.contact_number || 'Not provided'}</Text>
              )}
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.subText} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.editInput, { color: colors.text, borderBottomColor: colors.primary }]}
                  value={editedDetails.email}
                  keyboardType="email-address"
                  onChangeText={(val) => setEditedDetails({...editedDetails, email: val})}
                />
              ) : (
                <Text style={[styles.infoValue, { color: colors.text }]}>{userDetails?.email || 'Not provided'}</Text>
              )}
            </View>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editButtonRow}>
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={saveProfileChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cancelEditButton, { borderColor: colors.secondary }]}
              onPress={() => setIsEditing(false)}
            >
              <Text style={[styles.cancelEditButtonText, { color: colors.secondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.logoutButton, { borderColor: colors.secondary }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.secondary} />
            <Text style={[styles.logoutButtonText, { color: colors.secondary }]}>Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarContainer: {
    borderRadius: 50, // Make it circular
    overflow: 'hidden', // Clip image to the circular boundary
    borderWidth: 2,
    width: 104,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    marginTop: 5,
  },
  editProfileBtn: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 2,
    paddingBottom: 5,
    width: 180,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: '500',
  },
  editInput: {
    fontSize: 16,
    marginTop: 2,
    fontWeight: '500',
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelEditButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelEditButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
