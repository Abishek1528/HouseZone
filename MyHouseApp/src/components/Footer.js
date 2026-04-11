import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import footerStyles from './styles/footerStyles';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[footerStyles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home-outline" size={24} color={colors.text} />
        <Text style={[footerStyles.footerLabel, { color: colors.text }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("MyHistory")}
      >
        <Ionicons name="time-outline" size={24} color={colors.text} />
        <Text style={[footerStyles.footerLabel, { color: colors.text }]}>My History</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings-outline" size={24} color={colors.text} />
        <Text style={[footerStyles.footerLabel, { color: colors.text }]}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={footerStyles.footerItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons name="person-outline" size={24} color={colors.text} />
        <Text style={[footerStyles.footerLabel, { color: colors.text }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}