import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { server } from '../mocks/server';
import { renderWithProviders, mockNavigation } from '../utils/test-utils';
import LoginScreen from '../../screens/LoginScreen';

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);

    expect(getByText('Login')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('handles username input', () => {
    const { getByPlaceholderText } = renderWithProviders(<LoginScreen />);
    const usernameInput = getByPlaceholderText('Username');

    fireEvent.changeText(usernameInput, 'testuser');
    expect(usernameInput.props.value).toBe('testuser');
  });

  it('handles password input', () => {
    const { getByPlaceholderText } = renderWithProviders(<LoginScreen />);
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(passwordInput, 'password');
    expect(passwordInput.props.value).toBe('password');
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = renderWithProviders(<LoginScreen />);
    const passwordInput = getByPlaceholderText('Password');
    const toggleButton = getByTestId('password-toggle');

    // Initially password should be hidden
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Toggle to show password
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    // Toggle back to hide password
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('shows loading state during login', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    // Should show loading state
    expect(loginButton.props.loading).toBe(true);
  });

  it('handles successful login', async () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(loginButton.props.loading).toBe(false);
    });
  });

  it('handles login error', async () => {
    // Mock server error
    server.use(
      server.post('https://dummyjson.com/auth/login', () => {
        return new Response(null, { status: 400 });
      })
    );

    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(usernameInput, 'invalid');
    fireEvent.changeText(passwordInput, 'invalid');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText(/Invalid username or password/)).toBeTruthy();
    });
  });

  it('disables login button when fields are empty', () => {
    const { getByText } = renderWithProviders(<LoginScreen />);
    const loginButton = getByText('Sign In');

    expect(loginButton.props.disabled).toBe(true);
  });

  it('enables login button when fields are filled', () => {
    const { getByPlaceholderText, getByText } = renderWithProviders(<LoginScreen />);
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Sign In');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password');

    expect(loginButton.props.disabled).toBe(false);
  });
});
