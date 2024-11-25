import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import CardioImage from '../../assets/images/W2.png';
import StrengthImage from '../../assets/images/W1.png';
import FlexibilityImage from '../../assets/images/W3.png';

const WorkoutTimerScreen = ({ route }) => {
  const { workout } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStart = () => {
    setModalVisible(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };


  const closeModal = () => {
    setIsPlaying(false);
    setModalVisible(false);
  };

  const getWorkoutImage = (type) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return CardioImage;
      case 'strength':
        return StrengthImage;
      case 'flexibility':
        return FlexibilityImage;
      default:
        return null;
    }
  };

  const getWorkoutDescription = (type) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return 'Cardio exercises increase your heart rate and are excellent for burning calories and improving endurance.';
      case 'strength':
        return 'Strength training helps build muscle, increase strength, and enhance metabolism.';
      case 'flexibility':
        return 'Flexibility exercises improve your range of motion, reduce muscle stiffness, and enhance overall physical performance.';
      default:
        return 'No description available.';
    }
  };

  const getWorkoutExercises = (type) => {
    switch (type.toLowerCase()) {
      case 'cardio':
        return ['Running', 'Cycling', 'Jumping Jacks', 'High Knees', 'Burpees'];
      case 'strength':
        return ['Push-ups', 'Squats', 'Deadlifts', 'Bench Press', 'Lunges'];
      case 'flexibility':
        return [
          'Yoga',
          'Pilates',
          'Hamstring Stretch',
          'Shoulder Stretch',
          'Cat-Cow Stretch',
        ];
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.workoutType}>{workout.type}</Text>

        <Image
          source={getWorkoutImage(workout.type)}
          style={styles.workoutImage}
        />
        <Text style={styles.workoutDuration}>
          Duration: {workout.duration} mins
        </Text>

        <Text style={styles.workoutDescription}>
          {getWorkoutDescription(workout.type)}
        </Text>

        <Text style={styles.exerciseHeader}>Suggested Exercises:</Text>
        {getWorkoutExercises(workout.type).map((exercise, index) => (
          <View key={index} style={styles.exerciseContainer}>
            <Text style={styles.exerciseText}>• {exercise}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

      {/* Modal for Timer */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          {/* Close Button (Cross) */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Workout Timer</Text>

          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={parseInt(workout.duration, 10) * 60}
            colors={['#1E90FF', '#32CD32', '#FF6347']}
            onComplete={() => handleStop()}
          >
            {({ remainingTime }) => (
              <Text style={styles.timerText}>
                {Math.floor(remainingTime / 60)}:
                {remainingTime % 60 < 10
                  ? `0${remainingTime % 60}`
                  : remainingTime % 60}
              </Text>
            )}
          </CountdownCircleTimer>

          <View style={styles.modalButtonContainer}>
            {isPaused ? (
              <TouchableOpacity
                style={styles.resumeButton}
                onPress={handleResume}
              >
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={handlePause}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.stopButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  workoutType: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  workoutDuration: {
    color: '#fd3b3b',
    fontSize: 24,
    marginBottom: 20,
  },
  workoutImage: {
    width: 220,
    height: 220,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  workoutDescription: {
    color: '#f8f8f8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  exerciseHeader: {
    color: '#ffdd00',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseContainer: {
    backgroundColor: '#292929',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  exerciseText: {
    color: '#fff',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  pauseButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resumeButton: {
    backgroundColor: '#32cd32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  stopButton: {
    backgroundColor: '#dc143c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 190,
    right: 40,
    zIndex: 10,
    color: '#dc143c',
    fontSize: 28,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WorkoutTimerScreen;
