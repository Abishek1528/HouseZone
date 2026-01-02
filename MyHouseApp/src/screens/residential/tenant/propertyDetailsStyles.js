
import { StyleSheet } from "react-native";

const propertyDetailsStyles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    flex: 1
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 30
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 30
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    width: '100%'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    textAlign: 'center'
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  firstDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
    flex: 1.2
  },
  separator: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '600',
    paddingHorizontal: 5
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
    paddingLeft: 10
  },
  conditionRow: {
    marginBottom: 8,
    paddingVertical: 6,
  },
  conditionText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: 22,
  }
});

export default propertyDetailsStyles;