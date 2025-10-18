import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setCredentials, logout, AuthState } from '../../features/auth/authSlice';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        user: null,
        token: null,
      });
    });
  });

  describe('setCredentials', () => {
    it('should set user and token', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      };
      const token = 'mock-jwt-token';

      store.dispatch(setCredentials({ user, token }));

      const state = store.getState().auth;
      expect(state.user).toEqual(user);
      expect(state.token).toEqual(token);
    });

    it('should update existing credentials', () => {
      const initialUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };
      const initialToken = 'initial-token';

      store.dispatch(setCredentials({ user: initialUser, token: initialToken }));

      const updatedUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      };
      const updatedToken = 'updated-token';

      store.dispatch(setCredentials({ user: updatedUser, token: updatedToken }));

      const state = store.getState().auth;
      expect(state.user).toEqual(updatedUser);
      expect(state.token).toEqual(updatedToken);
    });
  });

  describe('logout', () => {
    it('should clear user and token', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      };
      const token = 'mock-jwt-token';

      // Set initial state
      store.dispatch(setCredentials({ user, token }));

      // Logout
      store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('should handle logout when already logged out', () => {
      // Logout when already logged out
      store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });
  });

  describe('state immutability', () => {
    it('should not mutate state when setting credentials', () => {
      const initialState = store.getState().auth;
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      };
      const token = 'mock-jwt-token';

      store.dispatch(setCredentials({ user, token }));

      expect(initialState).toEqual({
        user: null,
        token: null,
      });
    });

    it('should not mutate state when logging out', () => {
      const user = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
      };
      const token = 'mock-jwt-token';

      store.dispatch(setCredentials({ user, token }));
      const stateBeforeLogout = store.getState().auth;

      store.dispatch(logout());

      expect(stateBeforeLogout).toEqual({
        user,
        token,
      });
    });
  });
});
