import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../hooks/useTheme';

type Props = {
  visible: boolean;
  onAttemptBiometric: () => Promise<boolean>;
//   onPasswordSubmit: (pw: string) => Promise<boolean>;
};

export default function LockOverlay({ visible, onAttemptBiometric }: Props) {
//   const [password, setPassword] = useState('');
  const { colors } = useAppTheme();

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
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.onSurface }]}>Locked</Text>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>Unlock to continue using the app</Text>
          <View style={{ marginTop: 12 }}>
            <TouchableOpacity style={[styles.unlockButton, { backgroundColor: colors.primary }]} onPress={tryBiometric}>
              <Text style={[styles.unlockButtonText, { color: colors.onPrimary }]}>Unlock</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { marginTop: 8 },
  unlockButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    width: '100%',
    marginBottom: 8,
    borderRadius: 6,
  },
});
