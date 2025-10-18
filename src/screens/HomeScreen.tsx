import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { remove } from '../services/storage';
import { logout } from '../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../store/store';


export default function HomeScreen() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    remove('token');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome, {user?.username} 👋</Text>
      <Button mode="outlined" onPress={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
