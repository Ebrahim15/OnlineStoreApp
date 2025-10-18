import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { get, remove } from "../services/storage";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setCredentials, logout } from "../features/auth/authSlice";
import LoginScreen from "../screens/LoginScreen";
import { getMe } from "../services/authApi";
import BottomTabs from "./BottomTabs";
import CategorySelectionScreen from "../screens/CategorySelectionScreen";
import CategoryScreen from "../screens/CategoryScreen";

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
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = get("token");
      if (savedToken) {
        // const authenticated = await authenticateBiometric();
        // if (!authenticated) {
        //   dispatch(logout());
        //   remove('token');
        //   setLoading(false);
        //   return;
        // }
        try {
          const user = await getMe(savedToken);
          dispatch(setCredentials({ token: savedToken, user }));
        } catch {
          dispatch(logout());
          remove('token');
        }
      }
      setLoading(false);
    };
    restoreSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabs} />
          <Stack.Screen 
            name="CategorySelection" 
            component={CategorySelectionScreen}
            options={{ headerShown: true, title: 'Categories' }}
          />
          <Stack.Screen 
            name="Category" 
            component={CategoryScreen}
            options={({ route }) => ({ 
              headerShown: true, 
              title: route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1) + ' Products'
            })}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
