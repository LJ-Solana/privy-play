import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const storedWallet = await SecureStore.getItemAsync('xrplWallet');
      const storedPasskey = await SecureStore.getItemAsync('walletPasskey');

      if (!storedWallet || !storedPasskey) {
        Alert.alert('Error', 'No wallet found. Please complete the onboarding process.');
        router.replace('/onboarding');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your wallet',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Authentication successful, navigate to the main app
        router.replace('/home');
      } else {
        Alert.alert('Authentication Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      Alert.alert('Sign In Failed', 'An error occurred. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignIn} 
        disabled={isAuthenticating}
      >
        <Text style={styles.buttonText}>
          {isAuthenticating ? 'Authenticating...' : 'Sign In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});