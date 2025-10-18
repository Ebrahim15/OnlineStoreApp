import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';

type Props = {
  visible: boolean;
  onAttemptBiometric: () => Promise<boolean>;
//   onPasswordSubmit: (pw: string) => Promise<boolean>;
};

export default function LockOverlay({ visible, onAttemptBiometric }: Props) {
//   const [password, setPassword] = useState('');

  async function tryBiometric() {
    const ok = await onAttemptBiometric();
    if (!ok) {
      // optionally show reason
      // Alert.alert('Biometrics failed');
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Locked</Text>
          <Text style={styles.subtitle}>Use biometrics or enter your password</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Unlock" onPress={tryBiometric} />
          </View>

          {/* <View style={{ marginTop: 18 }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Fallback password"
              secureTextEntry
              style={styles.input}
            />
            <Button
              title="Unlock with password"
              onPress={async () => {
                const ok = await onPasswordSubmit(password);
                if (!ok) {
                  Alert.alert('Wrong password');
                } else {
                  setPassword('');
                }
              }}
            />
          </View> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '86%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { marginTop: 8, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    width: '100%',
    marginBottom: 8,
    borderRadius: 6,
  },
});
