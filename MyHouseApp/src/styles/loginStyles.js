import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
  },
  headerSection: {
    backgroundColor: '#1e3a5f', 
    paddingTop: 60,
    paddingBottom: 70,
    paddingHorizontal: 30,
    alignItems: 'flex-start',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#e2e8f0',
    marginTop: 5,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -50, 
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  formCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'left',
  },
  formCardSubtitle: {
    fontSize: 11,
    color: '#666',
    marginBottom: 20,
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 14,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  rememberText: {
    fontSize: 11,
    color: '#666',
  },
  forgotText: {
    fontSize: 11,
    color: '#1e3a5f',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signupLinkContainer: {
    alignItems: 'center',
  },
  signupLinkText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default loginStyles;
