import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Dummy() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoTextCDM}>CDM</Text>
            <Text style={styles.logoTextLifeHub}>LifeHub</Text>
          </View>
        </View>
      </View>

      <View style={styles.taglineSection}>
        <Text style={styles.primaryTagline}>Trusted By Thousands</Text>
        <Text style={styles.secondaryTagline}>Your Complete Rental & Job Platform</Text>
        <Text style={styles.brandName}>
          <Text style={styles.cdmText}>CDM </Text>
          <Text style={styles.lifeHubText}>LifeHub</Text>
        </Text>
      </View>

      <View style={styles.footerSection}>
        <View style={styles.taglineRow}>
          <Text style={styles.footerTaglinePart1}>Trusted • Reliable •</Text>
          <Text style={styles.footerTaglinePart2}> Easy</Text>
        </View>
        <Text style={styles.footerText}>Connecting You to Better Opportunities</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40
  },
  logoContainer: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center"
  },
  logoCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#1e3a5f",
    alignItems: "center",
    justifyContent: "center"
  },
  logoTextCDM: {
    fontSize: 40,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 3
  },
  logoTextLifeHub: {
    fontSize: 20,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 2,
    marginTop: -5
  },
  taglineSection: {
    alignItems: "center"
  },
  primaryTagline: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e3a5f",
    marginBottom: 8
  },
  secondaryTagline: {
    fontSize: 15,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 20
  },
  brandName: {
    marginTop: 10
  },
  cdmText: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1e3a5f"
  },
  lifeHubText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#3b82f6"
  },
  footerSection: {
    alignItems: "center"
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  footerTaglinePart1: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b"
  },
  footerTaglinePart2: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a5f"
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
    letterSpacing: 1.5
  }
});
