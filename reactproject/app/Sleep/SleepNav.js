import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SleepScreen from './screens/components/Sleep'
import GoalsScreen from './screens/components/Goals'
import InsightsScreen from './screens/components/Insights'
import ReportsScreen from './screens/components/Reports'
import HomeScreen from './screens/HomeScreen';
import ManualSleepLoggingscreen from './screens/components/ManualSleepLogging';
import SleepAnalyticsscreen from './screens/components/SleepAnalytics';

const Stack = createNativeStackNavigator();

export default function SleepNav() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#261F1C', // App bar background color
                },
                headerTintColor: '#fff', // App bar text color
                headerTitleStyle: {
                    fontWeight: 'bold', // Optional: Customize title font weight
                },
                headerTitleAlign: 'center',
                headerBackTitle: 'Back',
            }}
            initialRouteName="SleepHome"
        >
            <Stack.Screen name="SleepHome" component={HomeScreen} />
            <Stack.Screen name="Sleep" component={SleepScreen} />
            <Stack.Screen name="Goals" component={GoalsScreen} />
            <Stack.Screen name="Insights" component={InsightsScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
            <Stack.Screen name="ManualSleepLogging" component={ManualSleepLoggingscreen} />
            <Stack.Screen name="SleepAnalytics" component={SleepAnalyticsscreen} />

        </Stack.Navigator>
    );
}
