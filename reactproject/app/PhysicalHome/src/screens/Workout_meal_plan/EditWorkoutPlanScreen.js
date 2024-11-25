import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // Use the correct package
import { useNavigation } from '@react-navigation/native';


const EditWorkoutPlanScreen = ({ route }) => {
  const [cardioTime, setCardioTime] = useState(route.params?.cardioTime || 5);
  const [strengthTime, setStrengthTime] = useState(
    route.params?.strengthTime || 5
  );
  const [flexibilityTime, setFlexibilityTime] = useState(
    route.params?.flexibilityTime || 5
    );
    
    const navigation = useNavigation();
    
  const handleConfirm = () => {
    navigation.navigate('PersonalizedPlan', {
      cardioTime,
      strengthTime,
      flexibilityTime,
      category: route.params?.category || 'Normal Weight', // Add a default category if needed
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Workout Plan</Text>

      {/* Cardio Time Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Select Your Cardio Time</Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
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
        <Text style={styles.sliderLabel}>Select Your Strength Time</Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
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
        <Text style={styles.sliderLabel}> Select Your Flexibility Time</Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
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
    backgroundColor: '#1c1c1e',
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
    fontSize: 20,
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

export default EditWorkoutPlanScreen;
