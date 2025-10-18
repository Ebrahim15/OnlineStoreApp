import ReactNativeBiometrics from 'react-native-biometrics';

export const authenticateBiometric = async (promptMessage?: string): Promise<boolean> => {
  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
  try {
    const { available } = await rnBiometrics.isSensorAvailable();

    if (!available) return false;

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage: promptMessage ?? 'Unlock App'
    });

    return success;
  } catch (error) {
    console.log('Biometric auth error:', error);
    return false;
  }
};
