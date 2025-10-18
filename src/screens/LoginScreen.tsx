import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { login } from '../services/authApi';
import { set } from '../services/storage';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../store/store';
import { AuthResponse } from '../types/api';


export default function LoginScreen() {
  const [username, setUsername] = useState('kminchelle'); // dummyjson username
  const [password, setPassword] = useState('0lelplR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (!username || !password) {
        setError('Please enter a username and password');
        return;
      }
      const data: AuthResponse = await login(username, password);
      dispatch(setCredentials({ token: data.accessToken, user: { id: data.id, username: data.username, email: data.email } }));
      set('token', data.accessToken);
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Login
      </Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Sign In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
  error: { color: '#FF0000', textAlign: 'center', marginBottom: 10 },
});
