import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome'; // For adding icons
import * as Notifications from 'expo-notifications';

const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState(''); // Weight input in kg
  const [age, setAge] = useState('');
  const [temperature, setTemperature] = useState('');
  const [recommendedIntake, setRecommendedIntake] = useState(null);
  const [currentIntake, setCurrentIntake] = useState(0); // State for current intake

  useEffect(() => {
    const loadIntakeData = async () => {
      try {
        const storedRecommendedIntake = await AsyncStorage.getItem('recommendedIntake');
        const storedCurrentIntake = await AsyncStorage.getItem('currentIntake');

        if (storedRecommendedIntake !== null) {
          setRecommendedIntake(parseFloat(storedRecommendedIntake)); // Convert to float
        }

        if (storedCurrentIntake !== null) {
          setCurrentIntake(parseFloat(storedCurrentIntake)); // Convert to float
        }
      } catch (error) {
        console.error('Failed to load intake data', error);
      }
    };

    loadIntakeData();
    scheduleNotifications(); // Schedule notifications on mount
  }, []);

  const scheduleNotifications = async () => {
    // Request permissions for notifications
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission not granted', 'Please enable notifications in settings.');
      return;
    }

    // Cancel any existing notifications before scheduling new ones
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule notifications to repeat every minute
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Water Reminder',
        body: 'Don’t forget to drink water!',
        sound: true,
      },
      trigger: {
        seconds: 600, // Trigger every minute
        repeats: true,
      },
    });
  };

  const updateNotification = async () => {
    if (recommendedIntake === null) return;

    const remainingIntake = recommendedIntake - currentIntake;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Water Intake Update',
        body: `You have ${remainingIntake.toFixed(2)} ml left to drink today.`,
        sound: true,
      },
      trigger: {
        seconds: 600, // Update every minute
      },
    });
  };

  useEffect(() => {
    updateNotification();
  }, [currentIntake]); // Update notification when current intake changes

  const calculateWaterIntake = async () => {
    const weightInKg = parseFloat(weight);
    const temperatureInFahrenheit = parseFloat(temperature);

    // Validate inputs
    if (isNaN(weightInKg) || weightInKg <= 0) {
      Alert.alert('Input Error', 'Please enter a valid weight in kilograms.');
      return;
    }

    // Basic water intake calculation in milliliters (35 ml per kg)
    let waterIntakeMl = weightInKg * 35; // Basic calculation in milliliters

    // Add extra water for higher temperatures
    if (temperatureInFahrenheit > 80) {
      waterIntakeMl += 354.882; // Add 12 ounces in ml (approx. 354.882 ml)
    }

    // Set the recommended intake
    setRecommendedIntake(waterIntakeMl.toFixed(2)); // Round to 2 decimal places

    // Store the recommended intake in AsyncStorage
    try {
      await AsyncStorage.setItem('recommendedIntake', waterIntakeMl.toFixed(2));
    } catch (error) {
      console.error('Failed to save recommended intake', error);
    }

    // Reset current intake when calculating new intake
    setCurrentIntake(0);
    try {
      await AsyncStorage.setItem('currentIntake', '0');
    } catch (error) {
      console.error('Failed to reset current intake', error);
    }
  };

  const handleAddIntake = async (amount) => {
    if (recommendedIntake === null) {
      Alert.alert('Calculation Required', 'Please calculate your recommended intake first.');
      return;
    }

    // amount is in milliliters
    const amountInMl = amount;

    // Calculate the new intake
    const newIntake = currentIntake + amountInMl;

    // Convert recommended intake to number for comparison
    const recommendedIntakeNumber = parseFloat(recommendedIntake);

    if (newIntake <= recommendedIntakeNumber) {
      setCurrentIntake(newIntake);

      // Store the current intake in AsyncStorage
      try {
        await AsyncStorage.setItem('currentIntake', newIntake.toFixed(2));
      } catch (error) {
        console.error('Failed to save current intake', error);
      }
    } else {
      Alert.alert('Limit Exceeded', 'You cannot exceed your recommended daily intake.');
    }
  };

  const handleReset = async () => {
    setCurrentIntake(0);
    setRecommendedIntake(null); // Optionally reset recommended intake

    // Clear AsyncStorage
    try {
      await AsyncStorage.removeItem('currentIntake');
      await AsyncStorage.removeItem('recommendedIntake');
    } catch (error) {
      console.error('Failed to reset intake data', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💧 Water Intake Calculator</Text>

      

      <View style={styles.intakeButtons}>
        <TouchableOpacity style={styles.intakeButton} onPress={() => handleAddIntake(200)}>
          <Icon name="glass" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>200ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.intakeButton} onPress={() => handleAddIntake(500)}>
          <Icon name="glass" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>500ml</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.intakeButton} onPress={() => handleAddIntake(1000)}>
          <Icon name="tint" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>1L</Text>
        </TouchableOpacity>
      </View>



      {recommendedIntake !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.result}>
            Your recommended daily water intake is: 
            <Text style={styles.highlight}>{recommendedIntake} ml</Text>
          </Text>
          <Text style={styles.result}>
            Current Intake: 
            <Text style={styles.highlight}>{currentIntake.toFixed(2)} ml</Text>
          </Text>
          <Text style={styles.result}>
            Remaining: 
            <Text style={styles.highlight}>
              {(recommendedIntake - currentIntake).toFixed(2)} ml
            </Text>
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Intake</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter your weight (in kg)"
        placeholderTextColor="#aaa"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        placeholderTextColor="#aaa"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter the temperature (in °F)"
        placeholderTextColor="#aaa"
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.calculateButton} onPress={calculateWaterIntake}>
        <Text style={styles.buttonText}>Calculate Water Intake</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 70,
  },
  input: {
    height: 50,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  intakeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  intakeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#2C2C2C',
    borderWidth: 1,
    borderColor: '#3D85C6',
    marginBottom:20,
  },
  result: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default WaterIntakeCalculator;
