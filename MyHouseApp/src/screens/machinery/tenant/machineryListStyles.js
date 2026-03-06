import { StyleSheet } from "react-native";

const machineryListStyles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    borderRadius: 6,
    overflow: 'hidden'
  },
  propertyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee'
  },
  imageText: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center'
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  areaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  machineryInfo: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  typeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 2
  },
  modelText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4
  },
  rentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 4
  },
  viewMoreButton: {
    marginTop: 5
  },
  viewMoreText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold'
  },
  expandedDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  detailSection: {
    marginBottom: 10
  },
  detailHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    backgroundColor: '#e1f0fa',
    padding: 4,
    borderRadius: 2
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
    lineHeight: 18
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 20
  },
  noPropertiesText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 20
  }
});

export default machineryListStyles;
