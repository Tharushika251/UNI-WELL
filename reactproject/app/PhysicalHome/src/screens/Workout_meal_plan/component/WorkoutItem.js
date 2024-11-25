import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import { useNavigation } from '@react-navigation/native';
import { updateWorkoutStatus } from '../../../server/api'; // Ensure this is your correct API function import
import moment from 'moment';

const WorkoutItem = ({
  workout,
  image,
  planId,
  selectedDate, onWorkoutUpdate,
}) => {
  const [completionStatus, setCompletionStatus] = useState(
    workout.completed || 'pending'
  );
  const navigation = useNavigation();

  // Get today's date
  const todayDate = moment().format('YYYY-MM-DD');
  const workoutDate = moment(workout.date).format('YYYY-MM-DD'); // Assuming `workout.date` contains the workout date

  // Function to navigate to the Workout Timer Screen
  const handlePress = () => {
    if (workoutDate === selectedDate && workout.completed === 'Pending') {
      navigation.navigate('Workout Screen', { workout });
    } else {
      Alert.alert('This is Not today WorkOut')
    }
  };

  // Function to toggle completion status and update it in the backend
  const handleCompleteToggle = async (workoutId) => {
    if (workoutDate !== selectedDate) return; // Prevent updates if it's not today's workout

    const newCompletionStatus =
      completionStatus === 'complete' ? 'pending' : 'complete'; // Toggle between 'complete' and 'pending'
    setCompletionStatus(newCompletionStatus); // Optimistically update the state

    try {
      const response = await updateWorkoutStatus(
        planId,
        workoutId, // Pass workout ID (planId)
        workout.type, // Pass workout type
        newCompletionStatus // New completion status as a string
      );
      console.log('Workout completion updated successfully.', response.data);
      onWorkoutUpdate(); // Trigger the parent to refetch the updated workouts
    } catch (error) {
      console.error('Error updating workout completion:', error);
      setCompletionStatus(
        completionStatus === 'complete' ? 'pending' : 'complete'
      ); // Rollback the state in case of error
    }
  };

  return (
    <TouchableOpacity style={styles.workoutCard} onPress={handlePress}>
      {/* Image and text container with handlePress on the workout image */}
      <Image source={image} style={styles.workoutImage} />
      <View style={styles.textContainer}>
        <Text style={styles.workoutType}>{workout.type}</Text>
        <Text style={styles.workoutDuration}>{workout.duration} min</Text>
        <Text style={styles.workoutDuration}>{workout.completed}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleCompleteToggle(workout._id)} // Pass workout ID to the toggle function
        disabled={workoutDate !== todayDate} // Disable the button if it's not today's workout
      >
        {workout.completed === 'complete' ? (
          <Icon name="check-circle" size={40} color="#4CAF50" /> // Green checkmark for 'complete'
        ) : (
          <Icon name="circle-o" size={40} color="#FFCDD2" /> // Hollow circle for 'pending'
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  workoutImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  workoutType: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  workoutDuration: {
    color: '#ccc',
    fontSize: 16,
  },
  lockedText: {
    color: '#FF6347',
    fontSize: 14,
    marginTop: 10,
  },
});

export default WorkoutItem;
