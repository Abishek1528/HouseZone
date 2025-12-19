import { StyleSheet } from "react-native";

const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#800080", // Purple color for admin
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: "#808080", // Gray color for cancel
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  // New centered dashboard container
  dashboardContainerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  // Container for dashboard content to keep items grouped together
  dashboardContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#800080", // Purple color for admin
  },
  dashboardContent: {
    fontSize: 18,
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#ff6b6b", // Red color for logout
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
});

export default adminStyles;