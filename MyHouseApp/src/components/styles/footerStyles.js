import { StyleSheet } from "react-native";

const footerStyles = StyleSheet.create({
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
    marginBottom: 10,
  },
});

export default footerStyles;