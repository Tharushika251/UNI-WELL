import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
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

const MedicineReminder = () => {
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [medicineReminders, setMedicineReminders] = useState([]);
  
  const BASE_URL = 'http:/192.168.42.99:5000';


  useEffect(() => {
    fetchMedicineReminders();
  }, []);

  const fetchMedicineReminders = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/medicine-time/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMedicineReminders(data);
      } else if (response.status === 404) {
        setMedicineReminders([]);
      } else {
        Alert.alert('Error', 'Failed to fetch medicine reminders');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch medicine reminders');
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const currentTime = selectedTime || reminderTime;
    setShowPicker(false);
    setReminderTime(currentTime);
  };

  const saveMedicineReminder = async () => {
    if (!medicineName.trim()) {
      Alert.alert('Error', 'Please enter the medicine name');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/medicine-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          medicineName,
          medicineTime: reminderTime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Medicine reminder saved successfully!');
        scheduleMedicineNotification(medicineName, reminderTime);
        fetchMedicineReminders();
        setMedicineName('');
      } else {
        Alert.alert(
          'Error',
          data.message || 'Failed to save medicine reminder'
        );
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save medicine reminder');
    }
  };

  const scheduleMedicineNotification = async (medicineName, time) => {
    const notificationTime = new Date(time);
    notificationTime.setMinutes(notificationTime.getMinutes() - 5);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicine Reminder',
        body: `It's almost time to take your medicine: ${medicineName}`,
        data: { medicineName },
      },
      trigger: {
        date: notificationTime,
      },
    });
  };

  const deleteMedicineReminder = (medicineName) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the reminder for "${medicineName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteMedicineReminder(medicineName),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteMedicineReminder = async (medicineName) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/medicine-time/${userId}/${encodeURIComponent(
          medicineName
        )}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        fetchMedicineReminders();
      } else {
        Alert.alert(
          'Error',
          data.message || 'Failed to delete medicine reminder'
        );
      }
    } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete medicine reminder');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderText}>
        {item.medicineName} at{' '}
        {new Date(item.medicineTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <TouchableOpacity
        onPress={() => deleteMedicineReminder(item.medicineName)}
      >
        <Icon name="minus-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Medicine Reminder:</Text>
      <TextInput
        label="Medicine Name"
        placeholder="Enter medicine name"
        value={medicineName}
        onChangeText={setMedicineName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.buttonText}>Select Reminder Time</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={saveMedicineReminder}>
        <Text style={styles.buttonText}>Save Reminder</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Medicine Reminders:</Text>
      {medicineReminders.length > 0 ? (
        <FlatList
          data={medicineReminders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No medicine reminders set.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    borderColor: '#FFD700',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 4,
  },
  reminderText: {
    fontSize: 18,
    color: '#FFD700',
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4caf50', // Background color
    borderRadius: 20, // Adjust this value for more or less rounding
    paddingVertical: 10, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    alignItems: 'center', // Center text inside the button
    elevation: 3, // For Android shadow
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.3, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow radius for iOS
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff', // Text color
    fontSize: 16, // Text size
  },
});

export default MedicineReminder;
