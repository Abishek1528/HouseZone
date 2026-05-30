import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, TextInput, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImageView from "react-native-image-viewing";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';
import profileStyles from '../styles/profileStyles';
import { sanitizePhoneInput } from '../shared/utils/phoneInput';

export default function Profile() {
  const navigation = useNavigation();
  const route = useRoute();
  const [userDetails, setUserDetails] = useState({
    name: 'User',
    age: '',
    contact: '',
    email: ''
  });
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
        try {
          const details = JSON.parse(storedDetails);
          setUserDetails(details);
          setEditedDetails({
            name: details.name || '',
            age: details.age?.toString() || '',
            contact: details.contact || details.contact_number || '',
            email: details.email || ''
          });
        } catch (parseError) {
          console.error('Error parsing user details:', parseError);
          await AsyncStorage.removeItem('userDetails');
          Alert.alert("Error", "Session data corrupted. Please log in again.", [
            { text: "OK", onPress: () => navigation.navigate("Login") }
          ]);
        }
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={profileStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      
      <View style={profileStyles.headerSection}>
        <View style={profileStyles.headerTop}>
          <Text style={profileStyles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={profileStyles.headerIconButton}
            onPress={() => Alert.alert('Notifications', 'No new notifications yet.')}
          >
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={profileStyles.headerSubtitle}>Your account details and personal settings in one place.</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={profileStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={profileStyles.profileCard}>
          <View style={profileStyles.avatarWrapper}>
            <TouchableOpacity 
              onPress={() => {
                if (profileImage) setIsImageViewVisible(true);
                else pickImage();
              }} 
              style={profileStyles.avatarContainer}
            >
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={profileStyles.profileImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={70} color="#1e3a5f" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={profileStyles.editBadge}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={22} color="#fff" />
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
          
          <Text style={profileStyles.userName}>{userDetails?.name || 'User'}</Text>
          <Text style={profileStyles.userEmail}>{userDetails?.email || ''}</Text>
          
          {!isEditing && (
            <TouchableOpacity 
              style={profileStyles.editProfileBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={profileStyles.editProfileBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={profileStyles.infoSection}>
          <Text style={profileStyles.sectionTitle}>Personal Information</Text>
          
          <View style={profileStyles.infoRow}>
            <View style={profileStyles.iconWrapper}>
              <Ionicons name="person-outline" size={20} color="#2563eb" />
            </View>
            <View style={profileStyles.infoTextContainer}>
              <Text style={profileStyles.infoLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={profileStyles.editInput}
                  value={editedDetails.name}
                  onChangeText={(val) => setEditedDetails({...editedDetails, name: val})}
                />
              ) : (
                <Text style={profileStyles.infoValue}>{userDetails?.name || 'Not provided'}</Text>
              )}
            </View>
            {!isEditing && <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />}
          </View>

          <View style={profileStyles.infoRow}>
            <View style={profileStyles.iconWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#2563eb" />
            </View>
            <View style={profileStyles.infoTextContainer}>
              <Text style={profileStyles.infoLabel}>Age</Text>
              {isEditing ? (
                <TextInput
                  style={profileStyles.editInput}
                  value={editedDetails.age}
                  keyboardType="numeric"
                  onChangeText={(val) => setEditedDetails({...editedDetails, age: val})}
                />
              ) : (
                <Text style={profileStyles.infoValue}>{userDetails?.age || 'Not provided'}</Text>
              )}
            </View>
            {!isEditing && <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />}
          </View>

          <View style={profileStyles.infoRow}>
            <View style={profileStyles.iconWrapper}>
              <Ionicons name="call-outline" size={20} color="#2563eb" />
            </View>
            <View style={profileStyles.infoTextContainer}>
              <Text style={profileStyles.infoLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={profileStyles.editInput}
                  value={editedDetails.contact}
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={(val) => setEditedDetails({ ...editedDetails, contact: sanitizePhoneInput(val) })}
                />
              ) : (
                <Text style={profileStyles.infoValue}>{userDetails?.contact || userDetails?.contact_number || 'Not provided'}</Text>
              )}
            </View>
            {!isEditing && <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />}
          </View>

          <View style={profileStyles.infoRow}>
            <View style={profileStyles.iconWrapper}>
              <Ionicons name="mail-outline" size={20} color="#2563eb" />
            </View>
            <View style={profileStyles.infoTextContainer}>
              <Text style={profileStyles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={profileStyles.editInput}
                  value={editedDetails.email}
                  keyboardType="email-address"
                  onChangeText={(val) => setEditedDetails({...editedDetails, email: val})}
                />
              ) : (
                <Text style={profileStyles.infoValue}>{userDetails?.email || 'Not provided'}</Text>
              )}
            </View>
            {!isEditing && <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />}
          </View>
        </View>

        {isEditing ? (
          <View style={profileStyles.editButtonRow}>
            <TouchableOpacity 
              style={profileStyles.saveButton}
              onPress={saveProfileChanges}
            >
              <Text style={profileStyles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={profileStyles.cancelEditButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={profileStyles.cancelEditButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={profileStyles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#dc3545" />
            <Text style={profileStyles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Footer />
    </KeyboardAvoidingView>
  );
}
