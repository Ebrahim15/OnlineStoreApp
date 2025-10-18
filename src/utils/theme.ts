// import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightColors = {
  // Background colors
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceVariant: '#f0f0f0',
  
  // Text colors
  onBackground: '#333333',
  onSurface: '#333333',
  onSurfaceVariant: '#666666',
  
  // Primary colors
  primary: '#6200EE',
  onPrimary: '#ffffff',
  
  // Secondary colors
  secondary: '#03DAC6',
  onSecondary: '#000000',
  
  // Error colors
  error: '#ff4444',
  onError: '#ffffff',
  
  // Border colors
  outline: '#e0e0e0',
  outlineVariant: '#cccccc',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Special colors
  offline: '#ff6b6b',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkColors = {
  // Background colors
  background: '#121212',
  surface: '#1e1e1e',
  surfaceVariant: '#2d2d2d',
  
  // Text colors
  onBackground: '#e0e0e0',
  onSurface: '#e0e0e0',
  onSurfaceVariant: '#b0b0b0',
  
  // Primary colors
  primary: '#BB86FC',
  onPrimary: '#000000',
  
  // Secondary colors
  secondary: '#03DAC6',
  onSecondary: '#000000',
  
  // Error colors
  error: '#CF6679',
  onError: '#000000',
  
  // Border colors
  outline: '#3a3a3a',
  outlineVariant: '#4a4a4a',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Special colors
  offline: '#ff6b6b',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

export const createCustomTheme = (isDark: boolean) => {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const colors = getThemeColors(isDark);
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      onPrimary: colors.onPrimary,
      secondary: colors.secondary,
      onSecondary: colors.onSecondary,
      background: colors.background,
      onBackground: colors.onBackground,
      surface: colors.surface,
      onSurface: colors.onSurface,
      surfaceVariant: colors.surfaceVariant,
      onSurfaceVariant: colors.onSurfaceVariant,
      error: colors.error,
      onError: colors.onError,
      outline: colors.outline,
      outlineVariant: colors.outlineVariant,
    },
  };
};
