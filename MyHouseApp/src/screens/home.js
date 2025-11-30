import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.menu}>☰</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/25/25694.png" }}
            style={styles.logo}
          />
          <Text style={styles.title}>MyRentalApp</Text>
        </View>

        <View style={{ width: 30 }} />
      </View>

      {/* BUTTONS */}
      <View style={styles.middle}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>Residential</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>Business</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>Vehicles</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>Machinery</Text>
          </TouchableOpacity>
        </View>
      </View>

   
{/* FOOTER */}
<View style={styles.footer}>
  
  <TouchableOpacity style={styles.footerItem}>
    <Text style={styles.footerIcon}>⌂</Text>
    <Text style={styles.footerLabel}>Home</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.footerItem}>
    <Text style={styles.footerheart}>♡</Text>
    <Text style={styles.footerLabel}>Favorites</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.footerItem}>
    <Text style={styles.footerIcon}>👥</Text>
    <Text style={styles.footerLabel}>Profile</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.footerItem}>
    <Text style={styles.footerIcon}>⚙</Text>
    <Text style={styles.footerLabel}>Settings</Text>
  </TouchableOpacity>

</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menu: {
    fontSize: 24,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 25,
  },
  button: {
    width: 150,
    height: 150,
    backgroundColor: "#4A90E2",
    marginHorizontal: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
 footer: {
  height: 70,
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  borderTopWidth: 1,
  borderColor: "#ddd",
  backgroundColor: "#f4f4f4",
},
footerItem: {
  alignItems: "center",
},
footerIcon: {
  fontSize: 22,
  color: "#000",
  marginBottom: 2,
},
footerheart: {
  fontSize: 22,
  color: "#000",
  marginBottom: 0.5,
},


footerLabel: {
  fontSize: 11,
  color: "#000",
  marginBottom:10
},


});
