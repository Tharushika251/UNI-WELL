import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import PersonalizedPlanScreen from './src/screens/Workout_meal_plan/PersonalizedPlanScreen';
import BMICalculatorScreen from './src/screens/Workout_meal_plan/BMICalculatorScreen';
import DatePicker from './src/screens/Workout_meal_plan/component/DatePicker';
import WorkoutPlanScreen from './src/screens/Workout_meal_plan/WorkoutPlanScreen';
import WorkoutTimerScreen from './src/screens/Workout_meal_plan/component/WorkoutTimerScreen';
import EditWorkoutPlanScreen from './src/screens/Workout_meal_plan/EditWorkoutPlanScreen';
import HomeFitnessDietaryPlan from './src/screens/Workout_meal_plan/HomeFitnessDietaryPlan';
import BMIGraph from './src/screens/Workout_meal_plan/Report/BMIGraph';
import MealPlanScreen from './src/screens/Workout_meal_plan/MealPlanScreen';
import Quiz from './src/screens/Workout_meal_plan/Quiz';
import WorkoutGraph from './src/screens/Workout_meal_plan/Report/WorkoutGraph';
import ReportPage from './src/screens/Workout_meal_plan/Report/ReportPage';

const Stack = createNativeStackNavigator();

export default function PhysicNav() {
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
      initialRouteName="Physical Health Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="PersonalizedPlan"
        component={PersonalizedPlanScreen}
      />
      <Stack.Screen name="BMI Calculator" component={BMICalculatorScreen} />
      <Stack.Screen name="Datapick" component={DatePicker} />
      <Stack.Screen name="Workout Plan" component={WorkoutPlanScreen} />
      <Stack.Screen name="Workout Screen" component={WorkoutTimerScreen} />
      <Stack.Screen
        name="EditWorkoutPlanScreen"
        component={EditWorkoutPlanScreen}
      />
      <Stack.Screen
        name="Physical Health Home"
        component={HomeFitnessDietaryPlan}
      />
      <Stack.Screen name="bmiGraph" component={BMIGraph} />
      <Stack.Screen name="Meal Plan" component={MealPlanScreen} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="quizGraph" component={WorkoutGraph} />
      <Stack.Screen name="Report Summery" component={ReportPage} />
    </Stack.Navigator>
  );
}
