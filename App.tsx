/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthLockProvider } from './src/context/AuthLockProvider';
import { queryClient } from './src/services/queryClient';

function App() {

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#000000',
      secondary: '#000000',
    },
  };
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <AuthLockProvider>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <QueryClientProvider client={queryClient}>
            <PaperProvider theme={customTheme}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </PaperProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </AuthLockProvider>
    </Provider>
  );
}

export default App;
