import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import footerStyles from './styles/footerStyles';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={footerStyles.footer}>
      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home-outline" size={24} color="#000" />
        <Text style={footerStyles.footerLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={footerStyles.footerItem}>
        <Ionicons name="heart-outline" size={24} color="#000" />
        <Text style={footerStyles.footerLabel}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-outline" size={24} color="#000" />
        <Text style={footerStyles.footerLabel}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={footerStyles.footerItem}>
        <Ionicons name="settings-outline" size={24} color="#000" />
        <Text style={footerStyles.footerLabel}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}