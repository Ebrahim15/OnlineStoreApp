import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import LockOverlay from '../components/LockOverlay';

import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useUser } from '../hooks/useAuth';
import { get } from '../services/storage';
import { authenticateBiometric } from '../services/biometrics';
import { STORAGE_KEYS } from '../types';
import ResponderWrapper from '../components/ResponderWrapper';

const INACTIVITY_MS = 10000;

type AuthLockContextType = {
  locked: boolean;
  lockNow: () => void;
//   setFallbackPassword: (plain: string) => void;
};

const AuthLockContext = createContext<AuthLockContextType | undefined>(undefined);

export function useAuthLock() {
  const c = useContext(AuthLockContext);
  if (!c) throw new Error('useAuthLock must be used inside provider');
  return c;
}

export function AuthLockProvider({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const dispatch = useDispatch();
  const token = get(STORAGE_KEYS.TOKEN) ?? null;
  const { data: userData } = useUser(token);

  // reset inactivity timer
  function resetTimer() {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    console.log('Resetting timer - will lock in', INACTIVITY_MS / 1000, 'seconds');
    inactivityTimer.current = setTimeout(() => {
      console.log('Timer expired - locking app');
      lockNow();
    }, INACTIVITY_MS);
  }

  function lockNow() {
    setLocked(true);
  }

  // call this when user authenticates successfully
  async function unlockWithToken() {
    // restore token-based state (if needed)
    const token = get(STORAGE_KEYS.TOKEN);
    if (!token) {
      setLocked(false); // nothing to restore
      return;
    }
    
    // User data will be automatically fetched and set by useUser hook
    if (userData) {
      dispatch(setCredentials({ token, user: userData }));
    }
    
    setLocked(false);
    resetTimer();
  }

  async function attemptBiometric() {
    // const available = await isBiometryAvailable();
    // if (!available) return false;
    const ok = await authenticateBiometric('Unlock app');
    if (ok) {
      await unlockWithToken();
      return true;
    }
    return false;
  }

//   async function onPasswordSubmit(plain: string) {
//     const hash = get(STORAGE_KEYS.FALLBACK_PW_HASH);
//     if (!hash) return false;
//     const ok = verifyPassword(plain, hash);
//     if (!ok) return false;
//     await unlockWithToken();
//     return true;
//   }

  // store fallback password hash (call from settings when user sets password)
//   function setFallbackPassword(plain: string) {
//     const h = hashPassword(plain);
//     // store securely
//     // eslint-disable-next-line @typescript-eslint/no-use-before-define
//     storageSet(STORAGE_KEYS.FALLBACK_PW_HASH, h);
//   }

  // AppState: lock when going background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appState.current.match(/active/) && next.match(/inactive|background/)) {
        lockNow();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  // initial check: if token exists, show lock overlay at startup
  useEffect(() => {
    (async () => {
      const token = get(STORAGE_KEYS.TOKEN);
      if (token) {
        // on cold start, show lock overlay until auth
        setLocked(true);
      } else {
        setLocked(false);
      }
      resetTimer();
    })();
    // clear on unmount
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // expose controls to children (optionally)
  return (
    <AuthLockContext.Provider value={{ locked, lockNow }}>
      {/* Wrap children with a passive activity detector */}
      <ActivityDetector onActivity={resetTimer}>{children}</ActivityDetector>

      <LockOverlay
        visible={locked}
        onAttemptBiometric={attemptBiometric}
        // onPasswordSubmit={onPasswordSubmit}
      />
    </AuthLockContext.Provider>
  );
}


function ActivityDetector({ children, onActivity }: { children: React.ReactNode; onActivity: () => void }) {
  return (
    <ResponderWrapper onActivity={onActivity}>
      {children}
    </ResponderWrapper>
  );
}

// import { View, StyleSheet } from 'react-native';
// function ResponderWrapper({ children, onActivity }: { children: React.ReactNode; onActivity: () => void }) {
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => false, // Don't capture touch events
//       onMoveShouldSetPanResponder: () => false, // Don't capture move events
//       onPanResponderTerminationRequest: () => true, // Allow other components to take over
//       onShouldBlockNativeResponder: () => false, // Don't block native responders
//       onStartShouldSetPanResponderCapture: () => {
//         // Only capture for activity detection, don't prevent other components
//         onActivity();
//         return false; // Don't actually capture the event
//       },
//     })
//   ).current;

//   return (
//     <View
//       style={styles.flex}
//       {...panResponder.panHandlers}
//     >
//       {children}
//     </View>
//   );
// }
// const styles = StyleSheet.create({ flex: { flex: 1 } });
