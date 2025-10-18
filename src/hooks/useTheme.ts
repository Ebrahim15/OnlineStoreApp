import { useColorScheme } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getThemeColors } from '../utils/theme';

export const useAppTheme = () => {
  const isDark = useColorScheme() === 'dark';
  const paperTheme = useTheme();
  const colors = getThemeColors(isDark);
  
  return {
    isDark,
    colors,
    paperTheme,
  };
};
