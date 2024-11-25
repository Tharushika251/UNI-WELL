// screens/MealTimePicker.js

import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import { StyleSheet, View, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { TextInput } from 'react-native-paper';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const BASE_URL = 'http://192.168.42.99:5000'; // Replace with your actual backend URL

const MealTimePicker = () => {
  const [mealType, setMealType] = useState('breakfast'); // Current meal type being managed
  const [mealTimes, setMealTimes] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    fetchAllMealReminders();
  }, []);

  const fetchAllMealReminders = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      // Fetch breakfast, lunch, and dinner times
      const [breakfastRes, lunchRes, dinnerRes] = await Promise.all([
        fetch(`${BASE_URL}/breakfast-time/${userId}`),
        fetch(`${BASE_URL}/lunch-time/${userId}`),
        fetch(`${BASE_URL}/dinner-time/${userId}`),
      ]);

      if (breakfastRes.ok) {
        const breakfastData = await breakfastRes.json();
        setMealTimes(prev => ({ ...prev, breakfast: breakfastData }));
      } else if (breakfastRes.status !== 404) {
        Alert.alert('Error', 'Failed to fetch breakfast times');
      }

      if (lunchRes.ok) {
        const lunchData = await lunchRes.json();
        setMealTimes(prev => ({ ...prev, lunch: lunchData }));
      } else if (lunchRes.status !== 404) {
        Alert.alert('Error', 'Failed to fetch lunch times');
      }

      if (dinnerRes.ok) {
        const dinnerData = await dinnerRes.json();
        setMealTimes(prev => ({ ...prev, dinner: dinnerData }));
      } else if (dinnerRes.status !== 404) {
        Alert.alert('Error', 'Failed to fetch dinner times');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch meal reminders');
    }
  };

  const handleTimeChange = (event, time) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }
    setShowPicker(false);
    setSelectedTime(time || selectedTime);
  };

  const saveMealTime = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const payload = {
        userId,
        [`${mealType}Time`]: selectedTime,
      };

      const response = await fetch(`${BASE_URL}/${mealType}-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', `${capitalize(mealType)} time saved successfully!`);
        scheduleMealNotification(mealType, selectedTime);
        fetchAllMealReminders();
      } else {
        Alert.alert('Error', data.message || `Failed to save ${mealType} time`);
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', `Failed to save ${mealType} time`);
    }
  };

  const scheduleMealNotification = async (mealType, time) => {
    const notificationTime = new Date(time);
    notificationTime.setMinutes(notificationTime.getMinutes() - 5); // Notify 5 minutes before

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${capitalize(mealType)} Reminder 🍽️`,
        body: `It's almost time for your ${mealType}!`,
        data: { mealType },
      },
      trigger: {
        date: notificationTime,
      },
    });
  };

  const deleteMealTime = (mealType) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete your ${mealType} time?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteMealTime(mealType),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteMealTime = async (mealType) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/${mealType}-time/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', `${capitalize(mealType)} time deleted successfully!`);
        fetchAllMealReminders();
      } else {
        Alert.alert('Error', data.message || `Failed to delete ${mealType} time`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', `Failed to delete ${mealType} time`);
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const renderMealSection = (meal) => (
    <View key={meal} style={styles.mealSection}>
      <Text style={styles.mealTitle}>{capitalize(meal)} Time:</Text>
      {mealTimes[meal] ? (
        <View style={styles.mealTimeContainer}>
          <Text style={styles.mealTime}>
            {new Date(mealTimes[meal][`${meal}Time`]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <TouchableOpacity onPress={() => deleteMealTime(meal)}>
          <Icon name="minus-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noTimeText}>No {meal} time set.</Text>
      )}
    </View>
  );

  const handleMealTypeChange = (meal) => {
    setMealType(meal);
    // Optionally, set the selectedTime to existing meal time or current time
    if (mealTimes[meal] && mealTimes[meal][`${meal}Time`]) {
      setSelectedTime(new Date(mealTimes[meal][`${meal}Time`]));
    } else {
      setSelectedTime(new Date());
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🍽️ Meal Time Picker</Text>

      {/* Select Meal Type */}
      <View style={styles.mealTypeSelector}>
        {['breakfast', 'lunch', 'dinner'].map((meal) => (
          <TouchableOpacity
            key={meal}
            style={[
              styles.mealButton,
              mealType === meal && styles.selectedMealButton,
            ]}
            onPress={() => handleMealTypeChange(meal)}
          >
            <Text
              style={[
                styles.mealButtonText,
                mealType === meal && styles.selectedMealButtonText,
              ]}
            >
              {capitalize(meal)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Time Picker Section */}
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timePickerButton}>
        <Text style={styles.timePickerText}>
          Select {capitalize(mealType)} Time
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveMealTime}>
        <Text style={styles.buttonText}>Save {capitalize(mealType)} Time</Text>
      </TouchableOpacity>

      {/* Meal Sections */}
      {['breakfast', 'lunch', 'dinner'].map((meal) => renderMealSection(meal))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212', // Dark background
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color for a luxurious look
    marginBottom: 30,
    textAlign: 'center',
  },
  mealTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  mealButton: {
    flex: 1,
    backgroundColor: '#333333', // Dark button background
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedMealButton: {
    backgroundColor: '#FFD700', // Gold color when selected
  },
  mealButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedMealButtonText: {
    color: '#121212', // Dark text on gold background
  },
  timePickerButton: {
    width: '100%',
    backgroundColor: '#4caf50', // Green button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  timePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#FFD700', // Gold button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#121212', // Dark text on gold background
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealSection: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    elevation: 3,
  },
  mealTitle: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTime: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noTimeText: {
    fontSize: 16,
    color: '#aaa',
  },
});

export default MealTimePicker;
