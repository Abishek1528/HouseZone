import { StyleSheet } from 'react-native';
import { 
  scale, 
  verticalScale, 
  moderateScale, 
  responsiveFontSize,
  isTablet 
} from '../shared/utils/responsive';

const homeContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerSection: {
    backgroundColor: '#1e3a5f',
    paddingTop: verticalScale(isTablet() ? 40 : 30),
    paddingBottom: verticalScale(isTablet() ? 60 : 40),
    paddingHorizontal: scale(20),
    alignItems: 'flex-start',
    borderBottomLeftRadius: scale(35),
    borderBottomRightRadius: scale(35),
  },
  headerTitle: {
    fontSize: responsiveFontSize(isTablet() ? 40 : 32),
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(isTablet() ? 16 : 14),
    color: '#e2e8f0',
    marginTop: verticalScale(4),
    fontWeight: '500',
  },
  middle: {
    flex: 1,
    paddingHorizontal: scale(16),
    marginTop: verticalScale(-30),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: responsiveFontSize(isTablet() ? 22 : 18),
    fontWeight: '800',
    color: '#1e3a5f',
    marginBottom: verticalScale(12),
    marginTop: verticalScale(6),
  },
  pageTitle: {
    fontSize: responsiveFontSize(isTablet() ? 32 : 26),
    fontWeight: '800',
    color: '#1a1a1a',
  },
  button: {
    width: isTablet() ? '28%' : '44%',
    height: verticalScale(isTablet() ? 200 : 160),
    backgroundColor: '#fff',
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(4)
    },
    shadowOpacity: 0.12,
    shadowRadius: scale(10),
    elevation: isTablet() ? 10 : 6,
    borderWidth: 0,
  },
  btnText: {
    fontSize: responsiveFontSize(isTablet() ? 18 : 15),
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: verticalScale(6),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(35),
    borderTopRightRadius: scale(35),
    padding: scale(32),
    paddingBottom: verticalScale(45),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: responsiveFontSize(isTablet() ? 30 : 24),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(6),
    textAlign: 'center',
  },
  modalText: {
    fontSize: responsiveFontSize(isTablet() ? 18 : 15),
    color: '#666',
    marginBottom: verticalScale(24),
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: scale(14),
    paddingHorizontal: scale(4),
  },
  roleBtn: {
    flex: 1,
    maxWidth: scale(isTablet() ? 200 : 160),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(12),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(3) },
    shadowOpacity: 0.14,
    shadowRadius: scale(6),
    elevation: 4,
  },
  roleBtnOwner: {
    backgroundColor: '#0f213d',
    borderWidth: scale(2),
    borderColor: '#1e3a5f',
  },
  roleBtnTenant: {
    backgroundColor: '#2563eb',
    borderWidth: scale(2),
    borderColor: '#3b82f6',
  },
  roleBtnText: {
    color: '#fff',
    fontSize: responsiveFontSize(isTablet() ? 22 : 18),
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(18),
    borderWidth: scale(2),
    borderRadius: scale(16),
    borderColor: '#e5e7eb',
    backgroundColor: '#f8f8f8',
  },
  dropdownText: {
    fontSize: responsiveFontSize(isTablet() ? 20 : 17),
    color: '#1a1a1a',
    fontWeight: '500',
  },
  arrow: {
    fontSize: responsiveFontSize(isTablet() ? 18 : 16),
    color: '#666',
  },
  dropdownList: {
    borderWidth: scale(2),
    borderTopWidth: 0,
    borderRadius: scale(16),
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginTop: verticalScale(6),
  },
  dropdownItem: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(14),
    borderBottomWidth: scale(1),
    borderBottomColor: '#e5e7eb',
  },
  dropdownItemText: {
    fontSize: responsiveFontSize(isTablet() ? 20 : 17),
    color: '#1a1a1a',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(35),
  },
  modalButton: {
    flex: 1,
    paddingVertical: verticalScale(16),
    borderRadius: scale(22),
    alignItems: 'center',
    marginHorizontal: scale(10),
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#1e3a5f',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(isTablet() ? 20 : 17),
    fontWeight: 'bold',
  },
});

export default homeContentStyles;
