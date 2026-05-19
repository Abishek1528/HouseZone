import { StyleSheet } from "react-native";

const dummyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerSection: {
    backgroundColor: '#1e3a5f',
    paddingTop: 50,
    paddingBottom: 90,
    paddingHorizontal: 30,
    alignItems: 'flex-start',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  headerBrand: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    marginTop: 5,
  },
  mainTagline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    color: '#e2e8f0',
    marginBottom: 25,
    lineHeight: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuresGridColumn: {
    width: '48%',
  },
  featuresListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuresListItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -50,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#1e3a5f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.25,
  },
  adminBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default dummyStyles;
