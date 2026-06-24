import React from "react";
import { View, Text, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import footerStyles from './styles/footerStyles';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handleNavigation = (screenName) => {
    try {
      navigation.navigate(screenName);
    } catch (error) {
      console.error(`Navigation error to ${screenName}:`, error);
      Alert.alert("Navigation Error", `Could not navigate to ${screenName}. Please try again.`);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.card }}>
      <View style={[footerStyles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={footerStyles.footerItem}
          onPress={() => handleNavigation("Home")}
        >
          <Ionicons name="home-outline" size={22} color={colors.text} />
          <Text style={[footerStyles.footerLabel, { color: colors.text }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={footerStyles.footerItem}
          onPress={() => handleNavigation("MyHistory")}
        >
          <Ionicons name="time-outline" size={22} color={colors.text} />
          <Text style={[footerStyles.footerLabel, { color: colors.text }]}>My History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={footerStyles.footerItem}
          onPress={() => handleNavigation("Settings")}
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
          <Text style={[footerStyles.footerLabel, { color: colors.text }]}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={footerStyles.footerItem}
          onPress={() => handleNavigation("Profile")}
        >
          <Ionicons name="person-outline" size={22} color={colors.text} />
          <Text style={[footerStyles.footerLabel, { color: colors.text }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}