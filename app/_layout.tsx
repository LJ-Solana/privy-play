import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PrivyProvider } from '@privy-io/expo';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      border: '#2C2C2C',
    },
  };

  return (
    <PrivyProvider appId={'insert-your-privy-app-id'}>
      <ThemeProvider value={customDarkTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </PrivyProvider>
  );
}
