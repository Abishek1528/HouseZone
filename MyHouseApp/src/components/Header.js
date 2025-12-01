import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import headerStyles from './styles/headerStyles';

export default function Header() {
  return (
    <View style={headerStyles.header}>
      <TouchableOpacity>
        <Text style={headerStyles.menu}>☰</Text>
      </TouchableOpacity>

      <View style={headerStyles.headerCenter}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/25/25694.png" }}
          style={headerStyles.logo}
        />
        <Text style={headerStyles.title}>MyRentalApp</Text>
      </View>

      <View style={{ width: 30 }} />
    </View>
  );
}