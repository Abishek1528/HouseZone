import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const scale = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const responsiveFontSize = (fontSize) => {
  const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = fontSize * scaleFactor;
  return Math.round(newSize);
};

export const isTablet = () => {
  const ratio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return SCREEN_WIDTH >= 768 && ratio <= 1.6;
};
