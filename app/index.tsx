import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useOnboardingStatus } from './onboarding';
import OnboardingFlow from './onboarding';
import HomeScreen from './(tabs)/home';

export default function App() {
  const isOnboardingCompleteFromHook = useOnboardingStatus();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOnboardingCompleteFromHook !== null) {
      setIsOnboardingComplete(isOnboardingCompleteFromHook);
      setIsLoading(false);
    }
  }, [isOnboardingCompleteFromHook]);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#BB86FC" />
      </View>
    );
  }

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <HomeScreen />;
}