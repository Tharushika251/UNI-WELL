import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import MentalHealthHome from './MentalHealthHome';
import Checkin from './Checkin';
import CBTExercises from './CBTExercises';
import RoutinesScreen from './RoutinesScreen';
import WeeklySummary from './WeeklySummary';
import MeditationScreen from '../MentalHelth/MedittaionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for deep navigation within the "Home" tab
export default function MentalApp() {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#100d0c', // App bar background color
        },
        headerTintColor: '#fff', // App bar text color
        headerTitleStyle: {
          fontWeight: 'bold', // Optional: Customize title font weight
        },
        headerTitleAlign: 'center',
        headerBackTitle: 'Back',
      }}
      initialRouteName="MentalHealthHome"
    >
      <Stack.Screen name="MentalHealthHome" component={MentalHealthHome} />
      <Stack.Screen name="Checkin" component={Checkin} />
      <Stack.Screen name="Routines" component={RoutinesScreen} />
      <Stack.Screen name="WeeklySummary" component={WeeklySummary} />
      <Stack.Screen name="MeditationScreen" component={MeditationScreen} />
      <Stack.Screen name="CBTExercises" component={CBTExercises} />
    </Stack.Navigator>
  );
}

// // Main App Component
// export default function MentalApp() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const userId = await AsyncStorage.getItem('userId');
//         if (userId) {
//           setIsLoggedIn(true);
//         } else {
//           setIsLoggedIn(false);
//         }
//       } catch (error) {
//         console.error('Error checking login status:', error);
//       } finally {
//         setLoading(false); // Stop loading after checking
//       }
//     };

//     checkLoginStatus(); // Check login status when app starts
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#FF5722" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer independent={true}>
//       {isLoggedIn ? (
//         <Tab.Navigator
//           screenOptions={({ route }) => ({
//             tabBarIcon: ({ focused, color, size }) => {
//               let iconName;
//               if (route.name === 'Home') {
//                 iconName = focused ? 'home' : 'home-outline';
//               } else if (route.name === 'Check-In') {
//                 iconName = focused ? 'clipboard' : 'clipboard-outline';
//               } else if (route.name === 'CBT') {
//                 iconName = focused ? 'book' : 'book-outline';
//               } else if (route.name === 'Routines') {
//                 iconName = focused ? 'list' : 'list-outline';
//               }
//               return <Ionicons name={iconName} size={size} color={color} />;
//             },
//           })}
//           tabBarOptions={{
//             activeTintColor: '#FF5722',
//             inactiveTintColor: 'gray',
//           }}
//         >
//           <Tab.Screen name="Home" component={HomeStack} />
//           <Tab.Screen name="Check-In" component={Checkin} />
//           <Tab.Screen name="CBT" component={CBTExercises} />
//           <Tab.Screen name="Routines" component={RoutinesScreen} />
//         </Tab.Navigator>
//       ) : (
//         // Show login screen if the user is not logged in
//         <Stack.Navigator>
//           <Stack.Screen
//             name="Login"
//             component={Login}
//             options={{ headerShown: false }} // Hide the header for the login screen
//           />
//         </Stack.Navigator>
//       )}
//     </NavigationContainer>
//   );
// }
