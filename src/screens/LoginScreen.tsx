import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAppTheme } from '../hooks/useTheme';
import { useLogin } from '../hooks/useAuth';


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useAppTheme();
  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!username || !password) {
      return;
    }
    
    loginMutation.mutate({ username, password });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: colors.onBackground }]}>
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
      {loginMutation.error ? (
        <Text style={[styles.error, { color: colors.error }]}>
          {loginMutation.error.message || 'Invalid username or password'}
        </Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loginMutation.isPending}
        disabled={!username || !password}
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
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 32,
    fontWeight: 'bold',
  },
  input: { 
    marginBottom: 16,
  },
  button: { 
    marginTop: 16,
  },
  error: { 
    textAlign: 'center', 
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
});
