import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'poppins-semibold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'), 
  });

  // Move SplashScreen.preventAutoHideAsync inside useEffect
  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Prevent hiding splash screen initially

    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide the splash screen after fonts are loaded
    }
  }, [fontsLoaded, error]);

  // Show null until fonts are loaded to avoid rendering issues
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}
