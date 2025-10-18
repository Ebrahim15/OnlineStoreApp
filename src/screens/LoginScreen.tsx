import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { login, getMe } from '../services/authApi';
import { set } from '../services/storage';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../store/store';
import { AuthResponse } from '../types/api';


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      
      // Store token first
      set('token', data.accessToken);
      
      // Fetch user details with role information
      const userDetails = await getMe(data.accessToken);
      
      // Dispatch with complete user information including role
      dispatch(setCredentials({ 
        token: data.accessToken, 
        user: userDetails 
      }));
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
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
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
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 32,
    color: '#333',
    fontWeight: 'bold',
  },
  input: { 
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: { 
    marginTop: 16,
    backgroundColor: '#6200EE',
  },
  error: { 
    color: '#ff4444', 
    textAlign: 'center', 
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});
