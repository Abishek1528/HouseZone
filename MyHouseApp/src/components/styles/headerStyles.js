import { StyleSheet } from "react-native";

const headerStyles = StyleSheet.create({
  header: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  menu: {
    fontSize: 24,
    marginTop: 20, // Move down slightly
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5, // Move down slightly
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
    marginTop: 10
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop:10
  },
});

export default headerStyles;