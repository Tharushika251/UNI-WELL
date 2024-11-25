import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MeditationScreen({ navigation }) {
  const [seconds, setSeconds] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);

  useEffect(() => {
    let interval;
    if (isMeditating) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

  const handleStartMeditation = () => {
    setIsMeditating(true);
    setSeconds(0);
  };

  const handleStopMeditation = () => {
    setIsMeditating(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meditation Session</Text>
      <Text style={styles.timer}>{`${Math.floor(seconds / 60)}:${
        seconds % 60 < 10 ? '0' : ''
      }${seconds % 60}`}</Text>

      {isMeditating ? (
        <Button title="Stop Meditation" onPress={handleStopMeditation} color="#FF6B6B" />
      ) : (
        <Button title="Start Meditation" onPress={handleStartMeditation} color="#4CAF50" />
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  header: {
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 30,
  },
  timer: {
    fontSize: 48,
    color: '#ffffff',
    marginBottom: 30,
  },
});
