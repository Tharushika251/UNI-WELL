import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SplashScreen, Stack } from 'expo-router';


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="bookmark"
          options={{
            headerStyle: {
              backgroundColor: '#100d0c', // Custom color for the header background
            },
            headerTintColor: '#fff', // Color for the header text
          }}
        />
        <Stack.Screen
          name="create"
          options={{
            headerStyle: {
              backgroundColor: '#100d0c', // Custom color for the header background
            },
            headerTintColor: '#fff', // Color for the header text
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerStyle: {
              backgroundColor: '#100d0c', // Custom color for the header background
            },
            headerTintColor: '#fff', // Color for the header text
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
