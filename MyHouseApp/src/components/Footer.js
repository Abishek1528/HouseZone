import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import footerStyles from './styles/footerStyles';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={footerStyles.footer}>
      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={footerStyles.footerIcon}>⌂</Text>
        <Text style={footerStyles.footerLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={footerStyles.footerItem}>
        <Text style={footerStyles.footerheart}>♡</Text>
        <Text style={footerStyles.footerLabel}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={footerStyles.footerItem}>
        <Text style={footerStyles.footerIcon}>👥</Text>
        <Text style={footerStyles.footerLabel}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={footerStyles.footerItem}>
        <Text style={footerStyles.footerIcon}>⚙</Text>
        <Text style={footerStyles.footerLabel}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}