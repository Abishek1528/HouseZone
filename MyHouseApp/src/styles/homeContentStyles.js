import { StyleSheet } from 'react-native';

const homeContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerSection: {
    backgroundColor: '#1e3a5f',
    paddingTop: 55,
    paddingBottom: 80,
    paddingHorizontal: 30,
    alignItems: 'flex-start',
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#e2e8f0',
    marginTop: 8,
    fontWeight: '500',
  },
  middle: {
    flex: 1,
    paddingHorizontal: 22,
    marginTop: -40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  button: {
    width: '47%',
    height: 175,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 0,
  },
  btnText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 32,
    paddingBottom: 45,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  modalText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 22,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8f8f8',
  },
  dropdownText: {
    fontSize: 17,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 16,
    color: '#666',
  },
  dropdownList: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderRadius: 16,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginTop: 6,
  },
  dropdownItem: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dropdownItemText: {
    fontSize: 17,
    color: '#1a1a1a',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 22,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#1e3a5f',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default homeContentStyles;
