// src/components/RoutinesScreen.jsx
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

const routines = [
  { id: '1', name: 'Morning Walk', duration: 5 },
  { id: '2', name: 'Breakfast', duration: 15 },
  { id: '3', name: 'Meditation', duration: 10 },
];

export default function RoutinesScreen() {
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const startRoutine = (routine) => {
    setCurrentRoutine(routine);
    setRemainingTime(routine.duration * 60);
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCurrentRoutine(null);
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Routines</Text>
      {currentRoutine ? (
        <Text style={styles.timerText}>
          {currentRoutine.name}: {Math.floor(remainingTime / 60)}:
          {remainingTime % 60 < 10
            ? `0${remainingTime % 60}`
            : remainingTime % 60}
        </Text>
      ) : (
        <FlatList
          data={routines}
          renderItem={({ item }) => (
            <View style={styles.routineItem}>
              <Text style={styles.routineName}>{item.name}</Text>
              <Button
                title="Start"
                onPress={() => startRoutine(item)}
                color="#bb86fc"
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
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
    marginBottom: 20,
    color: '#ffffff', // White text for the header
  },
  timerText: {
    fontSize: 32,
    marginVertical: 20,
    color: '#03dac5', // Cyan color for the timer text
  },
  routineItem: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#1e1e1e', // Darker background for routine items
    borderRadius: 5, // Rounded corners for routine items
  },
  routineName: {
    fontSize: 18,
    color: '#ffffff', // White text for routine names
  },
});
