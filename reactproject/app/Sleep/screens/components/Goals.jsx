// SleepGoals.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const SleepGoals = () => {
  const [bedtime, setBedtime] = useState(new Date());
  const [wakeUpTime, setWakeUpTime] = useState(new Date());
  const [showBedtimePicker, setShowBedtimePicker] = useState(false);
  const [showWakeUpPicker, setShowWakeUpPicker] = useState(false);
  const [sleepDuration, setSleepDuration] = useState('');

  useEffect(() => {
    loadSleepGoals();
  }, []);

  const loadSleepGoals = async () => {
    try {
      const storedBedtime = await AsyncStorage.getItem('bedtime');
      const storedSleepDuration = await AsyncStorage.getItem('sleepDuration');

      if (storedBedtime !== null) {
        setBedtime(new Date(storedBedtime));
      }

      if (storedSleepDuration !== null) {
        setSleepDuration(storedSleepDuration);
        calculateWakeUpTime(new Date(storedBedtime), storedSleepDuration);
      }
    } catch (error) {
      console.error('Failed to load sleep goals', error);
    }
  };

  const calculateWakeUpTime = (bedtimeDate, duration) => {
    const durationInHours = parseFloat(duration);
    const wakeTime = new Date(bedtimeDate);
    wakeTime.setHours(bedtimeDate.getHours() + durationInHours);
    setWakeUpTime(wakeTime);
  };

  const scheduleSleepReminders = async (bedtimeTime, wakeUpTimeTime) => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission not granted', 'Please enable notifications in settings.');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule Bedtime Reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Bedtime Reminder',
        body: 'Time to wind down and prepare for bed.',
        sound: 'default', // Change to your alarm sound
      },
      trigger: {
        hour: bedtimeTime.getHours(),
        minute: bedtimeTime.getMinutes(),
        repeats: true,
      },
    });

    // Schedule Wake-Up Alarm
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Wake-Up Alarm',
        body: 'Good morning! Time to start your day.',
        sound: 'default', // Change to your alarm sound
      },
      trigger: {
        hour: wakeUpTimeTime.getHours(),
        minute: wakeUpTimeTime.getMinutes(),
        repeats: true,
      },
    });

    Alert.alert('Success', 'Sleep reminders have been set.');
  };

  const handleSaveGoals = async () => {
    if (!sleepDuration) {
      Alert.alert('Input Error', 'Please enter your sleep duration goal.');
      return;
    }

    // Validate that wake-up time is after bedtime
    const bedtimeDate = new Date(bedtime);
    calculateWakeUpTime(bedtimeDate, sleepDuration);

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem('bedtime', bedtime.toISOString());
      await AsyncStorage.setItem('sleepDuration', sleepDuration);

      // Schedule notifications
      scheduleSleepReminders(bedtime, wakeUpTime);
    } catch (error) {
      console.error('Failed to save sleep goals', error);
      Alert.alert('Error', 'There was an error saving your sleep goals.');
    }
  };

  const onBedtimeChange = (event, selectedDate) => {
    setShowBedtimePicker(Platform.OS === 'ios'); // Keep picker open on iOS
    if (selectedDate) {
      setBedtime(selectedDate);
      calculateWakeUpTime(selectedDate, sleepDuration);
    }
  };

  const onWakeUpChange = (event, selectedDate) => {
    setShowWakeUpPicker(Platform.OS === 'ios'); // Keep picker open on iOS
    if (selectedDate) {
      setWakeUpTime(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛌 Sleep Goals & Reminders</Text>

      {/* Bedtime Picker */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowBedtimePicker(true)}
      >
        <Icon name="moon-o" size={20} color="#FFFFFF" />
        <Text style={styles.pickerText}>
          Bedtime: {bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showBedtimePicker && (
        <DateTimePicker
          value={bedtime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onBedtimeChange}
        />
      )}

      {/* Wake-Up Time Display */}
      <View style={styles.wakeTimeContainer}>
        <Text style={styles.wakeTimeText}>
          Wake-Up Time: {wakeUpTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* Sleep Duration Goal */}
      <TextInput
        style={styles.input}
        placeholder="Enter your sleep duration goal (hours)"
        placeholderTextColor="#aaa"
        value={sleepDuration}
        onChangeText={setSleepDuration}
        keyboardType="numeric"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoals}>
        <Text style={styles.buttonText}>Save Sleep Goals</Text>
      </TouchableOpacity>

      {/* Display Current Sleep Goals */}
      {sleepDuration && (
        <View style={styles.goalsContainer}>
          <Text style={styles.goalsText}>
            <Text style={styles.goalsLabel}>Bedtime:</Text> {bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.goalsText}>
            <Text style={styles.goalsLabel}>Wake-Up Time:</Text> {wakeUpTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.goalsText}>
            <Text style={styles.goalsLabel}>Sleep Duration Goal:</Text> {sleepDuration} hours
          </Text>
        </View>
      )}
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
    marginBottom: 30,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  wakeTimeContainer: {
    marginBottom: 20,
  },
  wakeTimeText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  input: {
    height: 50,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  goalsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#2C2C2C',
    borderWidth: 1,
    borderColor: '#3D85C6',
  },
  goalsText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  goalsLabel: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default SleepGoals;
