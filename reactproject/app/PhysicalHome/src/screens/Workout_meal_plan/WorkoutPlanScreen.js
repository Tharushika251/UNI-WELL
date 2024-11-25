import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getPlanByUserId, deleteWorkoutPlan } from '../../server/api';
import DatePicker from './component/DatePicker';
import WorkoutItem from './component/WorkoutItem';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons'; // Icons
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutPlanScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  );
  const [planId, setPlanId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();
  const todayDate = moment().format('YYYY-MM-DD');
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const workoutImages = [
    require('../assets/images/W2.png'),
    require('../assets/images/W1.png'),
    require('../assets/images/W3.png'),
  ];

  // Function to fetch workouts
  const fetchWorkouts = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await getPlanByUserId(userId);
      if (response.data.plan) {
        setPlanId(response.data.plan._id);
        const endate = moment(response.data.plan.endDate).format('YYYY-MM-DD');

        if (todayDate < endate) {
          setWorkouts(response.data.plan.days);
        }
      } else {
        console.log('No incomplete workout plan found.');
      }
    } catch (error) {
      console.log('Error fetching workouts:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  const handleDelete = async (planId) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this workout plan?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion cancelled'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await deleteWorkoutPlan(planId);
              Alert.alert('Plan deleted successfully.');
              Toast.show({
                type: 'success',
                text1: 'Plan Deleted',
                text2: 'The workout plan was deleted successfully.',
              });
              navigation.navigate('Physical Health Home');
            } catch (error) {
              console.error('Error deleting workout plan:', error);
              Toast.show({
                type: 'error',
                text1: 'Deletion Failed',
                text2: 'There was an error deleting the workout plan.',
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleWorkoutUpdate = () => {
    fetchWorkouts();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
  };

  const filteredWorkouts = workouts.find(
    (workout) => moment(workout.date).format('YYYY-MM-DD') === selectedDate
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#eeeeee" />
        <Text style={styles.loadingText}>Loading workout plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!workouts.length ? (
        <View style={styles.noPlanContainer}>
          <Text style={styles.noPlanText}>No workout plan available</Text>
          <TouchableOpacity
            style={styles.addNewPlanButton}
            onPress={() => navigation.navigate('BMI Calculator')}
          >
            <Text style={styles.addNewPlanButtonText}>Add New Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <DatePicker
            onDateSelect={handleDateSelect}
            startDate={moment(workouts[0]?.date || Date.now())}
            workouts={workouts}
          />
          <FlatList
            data={filteredWorkouts?.workouts || []}
            renderItem={({ item, index }) => (
              <WorkoutItem
                workout={item}
                image={workoutImages[index]}
                planId={planId}
                selectedDate={selectedDate}
                onWorkoutUpdate={handleWorkoutUpdate}
              />
            )}
            keyExtractor={(item) => item.type + item.duration}
            contentContainerStyle={styles.workoutList}
          />
        </>
      )}

      <View style={styles.floatingContainer}>
        {isMenuOpen && (
          <>
            <TouchableOpacity
              style={styles.floatingActionButtonSecondary}
              onPress={() => {
                navigation.navigate('Quiz');
                toggleMenu();
              }}
            >
              <Text style={styles.buttonText}>Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingActionButtonSecondary}
              onPress={() => {
                navigation.navigate('Report Summery');
                toggleMenu();
              }}
            >
              <Text style={styles.buttonText}>Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingActionButtonSecondary}
              onPress={() => {
                handleDelete(planId);
              }}
            >
              <FontAwesome5 name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.floatingActionButton}
          onPress={toggleMenu}
        >
          <Text style={styles.mainButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171212',
    padding: 20,
  },
  workoutList: {
    paddingVertical: 20,
  },
  noPlanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPlanText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  addNewPlanButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  addNewPlanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#171212',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fefefe',
    fontSize: 16,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 3,
    right: 20,
    alignItems: 'center',
  },
  floatingActionButton: {
    backgroundColor: '#FF6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    marginBottom: 10,
  },
  floatingActionButtonSecondary: {
    backgroundColor: '#ff530f',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    color: '#fffdfd',
    fontWeight: '600',
    marginTop: 5,
    fontSize: 12,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default WorkoutPlanScreen;
