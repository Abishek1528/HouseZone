import { StyleSheet, Platform } from "react-native";

const footerStyles = StyleSheet.create({
  footer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f4f4f4",
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  footerItem: {
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 10,
    color: "#000",
    marginTop: 2,
  },
});

export default footerStyles;