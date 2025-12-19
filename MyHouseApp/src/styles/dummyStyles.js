import { StyleSheet } from "react-native";

const dummyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontSize: 18,
  },
  adminButton: {
    marginTop: 20,
    backgroundColor: '#800080',
  }
});

export default dummyStyles;