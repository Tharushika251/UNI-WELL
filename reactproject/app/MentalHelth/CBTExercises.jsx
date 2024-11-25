import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CBTExercises() {
  const [journalEntry, setJournalEntry] = useState('');
  const [affirmations, setAffirmations] = useState([]);
  const [affirmation, setAffirmation] = useState('');
  const [userId, setUserId] = useState(null); // State to hold user ID
  const [journalEntries, setJournalEntries] = useState([]); // State to hold all journal entries

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId'); // Fetch user ID from AsyncStorage
        if (id) {
          setUserId(id);
          fetchJournalEntries(id); // Fetch journal entries for the user after getting user ID
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId(); // Call function to fetch user ID
  }, []);

  const fetchJournalEntries = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/journal/${id}`); // Replace localhost with actual server URL
      if (!response.ok) {
        throw new Error('Failed to fetch journal entries.');
      }
      const data = await response.json();
      setJournalEntries(data); // Assuming the API returns an array of journal entries
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleJournalSubmit = async () => {
    if (!journalEntry.trim()) {
      Alert.alert('Error', 'Journal entry cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry: journalEntry, userId }), // Include userId
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Journal entry saved successfully!');
        setJournalEntry(''); // Clear the input
        fetchJournalEntries(userId); // Refresh the journal entries
      } else {
        Alert.alert('Error', data.message || 'An error occurred while saving the journal entry.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };

  const handleAffirmationSubmit = async () => {
    if (!affirmation.trim()) {
      Alert.alert('Error', 'Affirmation cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/affirmations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ affirmation, userId }), // Include userId
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Affirmation saved successfully!');
        setAffirmations([...affirmations, affirmation]); // Update the affirmations list
        setAffirmation(''); // Clear the input
        fetchJournalEntries(userId); // Refresh the journal entries
      } else {
        Alert.alert('Error', data.message || 'An error occurred while saving the affirmation.');
      }
    } catch (error) {
      console.error('Error saving affirmation:', error);
      Alert.alert('Error', 'Failed to save affirmation');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CBT Exercises</Text>

      {/* Journaling Section */}
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={journalEntry}
        onChangeText={setJournalEntry}
      />
      <TouchableOpacity style={styles.button} onPress={handleJournalSubmit}>
        <Text style={styles.buttonText}>Save Journal Entry</Text>
      </TouchableOpacity>

      {/* Display Journal Entries */}
      <FlatList
        data={journalEntries}
        renderItem={({ item }) => (
          <View style={styles.journalEntryContainer}>
            <Text style={styles.journalEntry}>{item.entry}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Affirmations Section */}
      <TextInput
        style={styles.input}
        placeholder="Write an affirmation..."
        value={affirmation}
        onChangeText={setAffirmation}
      />
      <TouchableOpacity style={styles.button} onPress={handleAffirmationSubmit}>
        <Text style={styles.buttonText}>Save Affirmation</Text>
      </TouchableOpacity>

      {/* Display Affirmations */}
      <FlatList
        data={affirmations}
        renderItem={({ item }) => (
          <Text style={styles.affirmation}>{item}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark background for the main container
  },
  header: {
    fontSize: 24,
    color: '#ffffff', // White text for the header
    marginBottom: 20,
    fontWeight: 'bold', // Bold header for emphasis
  },
  input: {
    height: 50,
    borderColor: '#444', // Darker border color
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10, // Padding for input text
    borderRadius: 5, // Rounded corners for input fields
    backgroundColor: '#1e1e1e', // Darker background for inputs
    color: '#ffffff', // White text for inputs
  },
  button: {
    backgroundColor: '#bb86fc', // A purple accent for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    elevation: 3, // Elevation for button shadow
  },
  buttonText: {
    color: '#ffffff', // White text for button
    textAlign: 'center',
    fontWeight: 'bold',
  },
  affirmation: {
    marginTop: 10,
    fontSize: 16,
    color: '#03dac5', // Cyan color for affirmations
  },
  journalEntryContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: '#444', // Darker border color for journal entries
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#1e1e1e', // Dark background for journal entries
  },
  journalEntry: {
    fontSize: 16,
    color: '#ffffff', // White text for journal entries
  },
});
