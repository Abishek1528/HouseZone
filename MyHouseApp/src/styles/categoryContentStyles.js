import { StyleSheet } from "react-native";

const categoryContentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    width: '100%',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  pageText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 15,
  },
  roleInfo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  pickerContainer: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  picker: {
    height: 65,
    width: '100%',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
    flex: 1,
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 90,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  secondaryButton: {
    backgroundColor: '#FF6B6B',
  },
  cancelButton: {
    backgroundColor: '#FF6B6B', 
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressContainer: {
    padding: 8,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  formContainer: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#4A90E2',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    width: '100%',
  },
  checkbox: {
    marginRight: 10,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4A90E2',
  },
  checkboxCheckmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
});

export default categoryContentStyles;