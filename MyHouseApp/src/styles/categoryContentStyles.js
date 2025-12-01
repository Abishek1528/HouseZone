import { StyleSheet } from "react-native";

const categoryContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  pageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  roleInfo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 30,
  },
});

export default categoryContentStyles;