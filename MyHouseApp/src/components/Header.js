import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import headerStyles from './styles/headerStyles';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { dark, colors } = useTheme();

  return (
    <View style={[headerStyles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <TouchableOpacity>
        <Ionicons name="menu-outline" size={30} color={colors.text} />
      </TouchableOpacity>

      <View style={headerStyles.headerCenter}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/25/25694.png" }}
          style={[headerStyles.logo, { tintColor: colors.primary }]}
        />
        <Text style={[headerStyles.title, { color: colors.text }]}>MyRentalApp</Text>
      </View>

      <View style={{ width: 30 }} />
    </View>
  );
}