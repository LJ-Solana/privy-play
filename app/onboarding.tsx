import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Wallet } from 'xrpl';

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkExistingWallet();
  }, []);

  const checkExistingWallet = async () => {
    try {
      const storedWallet = await SecureStore.getItemAsync('xrplWallet');
      const storedPasskey = await SecureStore.getItemAsync('walletPasskey');
      if (storedWallet && storedPasskey) {
        setWallet(JSON.parse(storedWallet));
        setStep(3);
      }
    } catch (error) {
      console.error('Error checking existing wallet:', error);
      Alert.alert('Error', 'Failed to check for existing wallet. Please try again.');
    }
  };

  const createXRPLWallet = async () => {
    setIsLoading(true);
    try {
      const newWallet = Wallet.generate();
      setWallet(newWallet);
      await SecureStore.setItemAsync('xrplWallet', JSON.stringify(newWallet));
      setStep(1);
    } catch (error) {
      console.error('Error creating XRPL wallet:', error);
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createPasskey = async () => {
    setIsLoading(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Error', 'Biometric authentication is not available on this device.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to secure your wallet',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await SecureStore.setItemAsync('walletPasskey', JSON.stringify(result));
        setStep(2);
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error creating passkey:', error);
      Alert.alert('Error', 'Failed to create passkey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const finishOnboarding = () => {
    console.log('Onboarding complete!');
    setStep(3);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View>
            <Text style={styles.text}>Step 1: Create XRPL Wallet</Text>
            <TouchableOpacity style={styles.button} onPress={createXRPLWallet} disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Wallet...' : 'Create Wallet'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.text}>Step 2: Secure Your Wallet</Text>
            <TouchableOpacity style={styles.button} onPress={createPasskey} disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Securing Wallet...' : 'Secure Wallet'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.text}>Step 3: Finish Onboarding</Text>
            <TouchableOpacity style={styles.button} onPress={finishOnboarding}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.text}>Onboarding Complete!</Text>
            <Text style={styles.text}>Your wallet is set up and secured.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.text]}>Wallet Onboarding</Text>
      {renderStep()}
      {isLoading && <ActivityIndicator size="large" color="#BB86FC" style={styles.loader} />}
    </View>
  );
};

export const useOnboardingStatus = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const storedWallet = await SecureStore.getItemAsync('xrplWallet');
        const storedPasskey = await SecureStore.getItemAsync('walletPasskey');
        setIsOnboardingComplete(!!storedWallet && !!storedPasskey);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  return isOnboardingComplete;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default OnboardingFlow;