// ManualSleepLogging.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const ManualSleepLogging = () => {
  const [sleepStart, setSleepStart] = useState(new Date());
  const [sleepEnd, setSleepEnd] = useState(new Date());
  const [showSleepStartPicker, setShowSleepStartPicker] = useState(false);
  const [showSleepEndPicker, setShowSleepEndPicker] = useState(false);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSleepLogs();
  }, []);

  // Load sleep logs from AsyncStorage
  const loadSleepLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem('sleepLogs');
      if (storedLogs !== null) {
        setSleepLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error('Failed to load sleep logs', error);
    }
  };

  // Save sleep logs to AsyncStorage
  const saveSleepLogs = async (logs) => {
    try {
      await AsyncStorage.setItem('sleepLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save sleep logs', error);
    }
  };

  // Handle adding a new sleep log
  const handleAddSleepLog = () => {
    if (sleepEnd <= sleepStart) {
      Alert.alert('Invalid Times', 'Sleep end time must be after sleep start time.');
      return;
    }

    const duration = moment.duration(moment(sleepEnd).diff(moment(sleepStart)));
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const sleepDuration = `${hours}h ${minutes}m`;

    const newLog = {
      id: Date.now().toString(),
      date: moment().format('YYYY-MM-DD'),
      sleepStart: sleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sleepEnd: sleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: sleepDuration,
      notes: notes || '',
    };

    const updatedLogs = [newLog, ...sleepLogs];
    setSleepLogs(updatedLogs);
    saveSleepLogs(updatedLogs);

    // Reset fields
    setSleepStart(new Date());
    setSleepEnd(new Date());
    setNotes('');

    Alert.alert('Success', 'Sleep log added successfully.');
  };

  // Handle deleting a sleep log
  const handleDeleteSleepLog = (id) => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this sleep log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedLogs = sleepLogs.filter((log) => log.id !== id);
            setSleepLogs(updatedLogs);
            saveSleepLogs(updatedLogs);
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render each sleep log item
  const renderSleepLog = ({ item }) => (
    <View style={styles.logItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.logDate}>{item.date}</Text>
        <Text style={styles.logDetails}>
          Start: {item.sleepStart} | End: {item.sleepEnd}
        </Text>
        <Text style={styles.logDetails}>Duration: {item.duration}</Text>
        {item.notes ? <Text style={styles.logNotes}>Notes: {item.notes}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => handleDeleteSleepLog(item.id)}>
        <Icon name="trash" size={24} color="#FF5733" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🛌 Manual Sleep Logging</Text>

      {/* Sleep Start Time Picker */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowSleepStartPicker(true)}
      >
        <Icon name="bed" size={20} color="#FFFFFF" />
        <Text style={styles.pickerText}>
          Sleep Start: {sleepStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showSleepStartPicker && (
        <DateTimePicker
          value={sleepStart}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowSleepStartPicker(false);
            if (selectedDate) {
              setSleepStart(selectedDate);
            }
          }}
        />
      )}

      {/* Sleep End Time Picker */}
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowSleepEndPicker(true)}
      >
        <Icon name="bell" size={20} color="#FFFFFF" />
        <Text style={styles.pickerText}>
          Sleep End: {sleepEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
      {showSleepEndPicker && (
        <DateTimePicker
          value={sleepEnd}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            setShowSleepEndPicker(false);
            if (selectedDate) {
              setSleepEnd(selectedDate);
            }
          }}
        />
      )}

      {/* Notes Input */}
      <TextInput
        style={styles.input}
        placeholder="Add notes (optional)"
        placeholderTextColor="#aaa"
        value={notes}
        onChangeText={setNotes}
      />

      {/* Add Sleep Log Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddSleepLog}>
        <Text style={styles.buttonText}>Add Sleep Log</Text>
      </TouchableOpacity>

      {/* Sleep Logs List */}
      <Text style={styles.historyTitle}>📝 Sleep History</Text>
      {sleepLogs.length === 0 ? (
        <Text style={styles.noLogsText}>No sleep logs available.</Text>
      ) : (
        <FlatList
          data={sleepLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderSleepLog}
          contentContainerStyle={styles.logsContainer}
        />
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
    marginBottom: 20,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
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
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  noLogsText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  logsContainer: {
    paddingBottom: 20,
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  logDate: {
    fontSize: 16,
    color: '#3D85C6',
    marginBottom: 5,
  },
  logDetails: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  logNotes: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 5,
  },
});

export default ManualSleepLogging;
