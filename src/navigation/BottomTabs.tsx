import React from 'react';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';

import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { logout } from '../features/auth/authSlice';
import { useAppDispatch } from '../store/store';
import { remove } from '../services/storage';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    remove('token');
  };
  const handleTabBarIcon = ({
    route,
    color,
    size,
  }: {
    route: RouteProp<ParamListBase>;
    color: string;
    size: number;
  }) => {
    let iconName: string = 'home';

    if (route.name === 'Home') iconName = 'home';
    else if (route.name === 'Products') iconName = 'cube-outline';
    else if (route.name === 'Profile') iconName = 'person';
    else if (route.name === 'Settings') iconName = 'settings';

    return <Icon name={iconName} size={size} color={color} />;
  };
  const handleLogoutTab = (props: BottomTabBarButtonProps) => (
    <TouchableOpacity
      {...(props as TouchableOpacityProps)}
      onPress={handleLogout}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon name="log-out" size={24} color="gray" />
    </TouchableOpacity>
  );
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) =>
          handleTabBarIcon({ route, color, size }),
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="CategorySelection" 
            component={CategorySelectionScreen}
            options={{ headerShown: true, title: 'Categories' }} />
      {/* Logout tab */}
      <Tab.Screen
        name="Logout"
        component={LoginScreen}
        options={{
          tabBarButton: props => handleLogoutTab(props),
        }}
      />
    </Tab.Navigator>
  );
}
