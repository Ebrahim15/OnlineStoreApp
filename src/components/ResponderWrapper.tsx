import { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanResponder } from 'react-native';

export default function ResponderWrapper({ children, onActivity }: { children: React.ReactNode; onActivity: () => void }) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // Don't capture touch events
      onMoveShouldSetPanResponder: () => false, // Don't capture move events
      onPanResponderTerminationRequest: () => true, // Allow other components to take over
      onShouldBlockNativeResponder: () => false, // Don't block native responders
      onStartShouldSetPanResponderCapture: () => {
        // Only capture for activity detection, don't prevent other components
        onActivity();
        return false; // Don't actually capture the event
      },
    })
  ).current;

  return (
    <View
      style={styles.flex}
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
}
const styles = StyleSheet.create({ flex: { flex: 1 } });