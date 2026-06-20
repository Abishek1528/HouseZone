import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

/**
 * Scale a size based on screen width
 */
export const scale = (size) => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale a size based on screen height
 */
export const verticalScale = (size) => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Moderate scale with control over the scaling factor
 */
export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

/**
 * Get responsive font size
 */
export const responsiveFontSize = (size) => {
  return moderateScale(size);
};

/**
 * Get responsive padding/margin
 */
export const responsiveSpacing = (size) => {
  return scale(size);
};

/**
 * Detect if device is a tablet
 */
export const isTablet = () => {
  const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  return (SCREEN_WIDTH >= 768 && SCREEN_HEIGHT >= 768) && aspectRatio < 2;
};

/**
 * Detect if device is in landscape mode
 */
export const isLandscape = () => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

/**
 * Detect platform
 */
export const isIOS = () => Platform.OS === 'ios';
export const isAndroid = () => Platform.OS === 'android';

export { SCREEN_WIDTH, SCREEN_HEIGHT };
