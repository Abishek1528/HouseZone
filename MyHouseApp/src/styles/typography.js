import { Platform } from 'react-native';

const typography = {
  fonts: {
    primary: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'sans-serif-medium',
    }),
    black: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium', // Fallback for black
      default: 'sans-serif-medium',
    }),
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  }
};

export default typography;
