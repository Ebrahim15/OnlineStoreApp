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
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthLockProvider } from './src/context/AuthLockProvider';
import { queryClient } from './src/services/queryClient';
import { createCustomTheme } from './src/utils/theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = createCustomTheme(isDarkMode);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthLockProvider>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <PaperProvider theme={theme}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </PaperProvider>
          </SafeAreaProvider>
        </AuthLockProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
