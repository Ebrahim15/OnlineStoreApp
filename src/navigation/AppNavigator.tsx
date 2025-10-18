import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "../store/store";
import LoginScreen from "../screens/LoginScreen";
import BottomTabs from "./BottomTabs";
import CategorySelectionScreen from "../screens/CategorySelectionScreen";
import CategoryScreen from "../screens/CategoryScreen";
import { useColorScheme } from 'react-native';
import { useAuthStatus } from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { useAppTheme } from '../hooks/useTheme';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  MainTabs: undefined;
  Details: { id: string };
  CategorySelection: undefined;
  Category: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token } = useAppSelector((state) => state.auth);
  const isDarkMode = useColorScheme() === 'dark';
  const { colors } = useAppTheme();
  const { isLoading } = useAuthStatus();

  const loadingStyle = {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
  };

  if (isLoading) {
    return (
      <View style={loadingStyle}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        statusBarStyle: isDarkMode ? 'light' : 'dark',
        statusBarBackgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      }}
    >
      {token ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen 
            name="CategorySelection" 
            component={CategorySelectionScreen}
            options={{ 
              headerShown: true, 
              title: 'Categories',
              statusBarStyle: isDarkMode ? 'light' : 'dark',
              statusBarBackgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            }}
          />
          <Stack.Screen 
            name="Category" 
            component={CategoryScreen}
            options={({ route }) => ({ 
              headerShown: true, 
              title: route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1) + ' Products',
              statusBarStyle: isDarkMode ? 'light' : 'dark',
              statusBarBackgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            })}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
