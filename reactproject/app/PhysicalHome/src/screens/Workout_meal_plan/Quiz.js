import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // Use the correct package
import { useNavigation } from '@react-navigation/native';
import { addQuiz } from '../../server/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Quiz = () => {
  const [cardioTime, setCardioTime] = useState('');
  const [strengthTime, setStrengthTime] = useState('');
  const [flexibilityTime, setFlexibilityTime] = useState('');
  const navigation = useNavigation();

    const [userId, setUserId] = useState(null);

    // Fetch the userId when the component mounts
    useEffect(() => {
      const fetchUserId = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            console.log(storedUserId);
            setUserId(storedUserId); // Update state with the retrieved userId
          } else {
            Alert.alert('Error', 'No user ID found in storage');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to retrieve user ID');
        }
      };

      fetchUserId();
    }, []);
  
  const handleConfirm = async () => {
    const newData = {
      UserId: userId,
      cardioTime,
      strengthTime,
      flexibilityTime,
    };
    if (newData) {
      await addQuiz(newData);
      console.log('Added to Quiz');
      navigation.navigate('Workout Plan');
    } else {
      alert('Error: Please fill in all required fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Workout Quiz</Text>

      {/* Cardio Time Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Select Your Today Cardio Time</Text>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={60}
          value={cardioTime}
          step={5}
          minimumTrackTintColor="#FF6347"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FF6347"
          onValueChange={(value) => setCardioTime(value)}
        />
        <Text style={styles.timeDisplay}>{cardioTime}/60 min</Text>
      </View>

      {/* Strength Time Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Select Your Today Strength Time</Text>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={60}
          value={strengthTime}
          step={5}
          minimumTrackTintColor="#FF6347"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FF6347"
          onValueChange={(value) => setStrengthTime(value)}
        />
        <Text style={styles.timeDisplay}>{strengthTime}/60 min</Text>
      </View>

      {/* Flexibility Time Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Select Your Today Flexibility Time</Text>
        <Slider
          style={styles.slider}
          minimumValue={20}
          maximumValue={60}
          value={flexibilityTime}
          step={5}
          minimumTrackTintColor="#FF6347"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FF6347"
          onValueChange={(value) => setFlexibilityTime(value)}
        />
        <Text style={styles.timeDisplay}>{flexibilityTime}/60 min</Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B1B17',
    padding: 20,
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sliderContainer: {
    backgroundColor: '#4E342E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sliderLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeDisplay: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Quiz;
