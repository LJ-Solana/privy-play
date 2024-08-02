import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [wallet, setWallet] = useState<{ address: string; secret: string } | null>(null);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkExistingWallet();

    navigation.setOptions({
      tabBarStyle: { display: 'none' },
      headerShown: false,
    });

    return () => {
      navigation.setOptions({
        tabBarStyle: undefined,
        headerShown: true,
      });
    };
  }, [navigation]);

  const checkExistingWallet = async () => {
    try {
      console.log('Checking for existing wallet...');
      const storedWallet = await SecureStore.getItemAsync('xrplWallet');
      const storedPasskey = await SecureStore.getItemAsync('walletPasskey');
      console.log('Stored wallet:', storedWallet ? 'exists' : 'not found');
      console.log('Stored passkey:', storedPasskey ? 'exists' : 'not found');
      if (storedWallet && storedPasskey) {
        setWallet(JSON.parse(storedWallet));
        setStep(4);
        console.log('Existing wallet found, setting step to 4');
      } else {
        console.log('No existing wallet found');
      }
    } catch (error) {
      console.error('Error checking existing wallet:', error);
      Alert.alert('Error', 'Failed to check for existing wallet. Please try again.');
    }
  };

  const createXRPLWallet = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to create XRPL wallet...');
      const response = await axios.post('https://xrplcluster.com/', {
        method: 'wallet_propose',
        params: [{}]
      });
      const newWallet = response.data.result;
      console.log('New wallet generated:', newWallet.account_id);
      setWallet({ address: newWallet.account_id, secret: newWallet.master_seed });
      setSeedPhrase(newWallet.master_seed || '');
      const walletString = JSON.stringify({ address: newWallet.account_id, secret: newWallet.master_seed });
      console.log('Storing wallet in SecureStore...');
      await SecureStore.setItemAsync('xrplWallet', walletString);
      console.log('Wallet stored successfully');
      setStep(1);
      console.log('Step set to 1');
    } catch (error) {
      console.error('Error creating XRPL wallet:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('Wallet creation process completed');
      if (!wallet) {
        Alert.alert('Error', 'Failed to create wallet. Please try again.');
      }
    }
  };

  const createPasskey = async () => {
    setIsLoading(true);
    try {
      console.log('Checking biometric hardware...');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Has biometric hardware:', hasHardware);
      console.log('Is biometric enrolled:', isEnrolled);

      if (!hasHardware || !isEnrolled) {
        console.log('Biometric authentication not available');
        Alert.alert('Error', 'Biometric authentication is not available on this device.');
        return;
      }

      console.log('Attempting biometric authentication...');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to secure your wallet',
        disableDeviceFallback: false,
      });

      console.log('Authentication result:', result);

      if (result.success) {
        console.log('Authentication successful, storing passkey...');
        await SecureStore.setItemAsync('walletPasskey', JSON.stringify(result));
        console.log('Passkey stored successfully');
        setStep(3);
        console.log('Step set to 3');
      } else {
        console.log('Authentication failed');
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error creating passkey:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      Alert.alert('Error', 'Failed to create passkey. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('Passkey creation process completed');
    }
  };

  const finishOnboarding = () => {
    console.log('Onboarding complete!');
    setStep(4);
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
            <Text style={styles.text}>Step 2: Save Your Seed Phrase</Text>
            <ScrollView style={styles.seedPhraseContainer}>
              <Text style={styles.seedPhrase}>{seedPhrase}</Text>
            </ScrollView>
            <Text style={styles.warningText}>
              Warning: Never share your seed phrase with anyone. Store it securely offline.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>I've Saved My Seed Phrase</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.text}>Step 3: Secure Your Wallet</Text>
            <TouchableOpacity style={styles.button} onPress={createPasskey} disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Securing Wallet...' : 'Secure Wallet'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.text}>Step 4: Finish Onboarding</Text>
            <TouchableOpacity style={styles.button} onPress={finishOnboarding}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        );
      case 4:
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
        console.log('Checking onboarding status...');
        const storedWallet = await SecureStore.getItemAsync('xrplWallet');
        const storedPasskey = await SecureStore.getItemAsync('walletPasskey');
        console.log('Stored wallet:', storedWallet ? 'exists' : 'not found');
        console.log('Stored passkey:', storedPasskey ? 'exists' : 'not found');
        setIsOnboardingComplete(!!storedWallet && !!storedPasskey);
        console.log('Onboarding status:', !!storedWallet && !!storedPasskey ? 'complete' : 'incomplete');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
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
  seedPhraseContainer: {
    maxHeight: 100,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
  },
  seedPhrase: {
    color: '#BB86FC',
    fontSize: 16,
    textAlign: 'center',
  },
  warningText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default OnboardingFlow;