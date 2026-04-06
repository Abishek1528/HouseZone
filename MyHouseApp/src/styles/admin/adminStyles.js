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
  // Grid layout for buttons
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 800,
  },
  // Individual dashboard button
  dashboardButton: {
    backgroundColor: "#800080", // Purple color for admin
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '48%', // Almost 50% to account for margins
    margin: '1%',
    alignItems: "center",
    marginBottom: 10,
    minHeight: 60,
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: "#ff6b6b", // Red color for logout
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: "90%",
    maxWidth: 600,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#800080",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  cardSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    padding: 4,
    borderRadius: 4,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
  noPropertyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
});

export default adminStyles;