import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { createPlan } from '../../server/api';
import { MaterialIcons } from '@expo/vector-icons'; // for edit icons
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalizedPlanScreen = ({ route }) => {
  const { category, cardioTime, strengthTime, flexibilityTime } = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
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

  const getPlan = () => {
    switch (category) {
      case 'Underweight':
        return {
          Days: 7,
          cTime: cardioTime || 30,
          sTime: strengthTime || 20,
          fTime: flexibilityTime || 15,
          Breakfast:
            'Kola kenda (herbal porridge) with coconut roti and bananas',
          Lunch: 'Chicken curry with red rice and dhal',
          Dinner: 'Fish curry with green leafy vegetables and kurakkan roti',
          diet: 'Increase intake of high-calorie, nutrient-dense foods...',
        };

      case 'Normal Weight':
        return {
          Days: 7,
          cTime: cardioTime || 30,
          sTime: strengthTime || 25,
          fTime: flexibilityTime || 15,
          Breakfast: 'Pol sambol with whole grain bread and a boiled egg',
          Lunch: 'Rice and curry with chicken, gotu kola sambol...',
          Dinner: 'Grilled fish with steamed vegetables and jak fruit curry',
          diet: 'Maintain a balanced diet with an appropriate mix...',
        };

      case 'Overweight':
        return {
          Days: 7,
          cTime: cardioTime || 45,
          sTime: strengthTime || 30,
          fTime: flexibilityTime || 20,
          Breakfast: 'Hoppers with lunu miris and fresh fruits',
          Lunch: 'Lean chicken curry with boiled vegetables...',
          Dinner:
            'Vegetable soup with lean meat and a small portion of whole wheat roti',
          diet: 'Calorie-controlled diet to promote weight loss...',
        };

      case 'Obesity':
        return {
          Days: 7,
          cTime: cardioTime || 30,
          sTime: strengthTime || 20,
          fTime: flexibilityTime || 20,
          Breakfast: 'Fruit smoothie with local fruits and oats',
          Lunch:
            'Steamed fish with green beans and a small portion of brown rice',
          Dinner: 'Vegetable stir-fry with red rice and boiled lentils',
          diet: 'Strict calorie reduction with a focus on nutrient-dense, low-calorie foods...',
        };

      default:
        return {
          Days: 0,
          cTime: 0,
          sTime: 0,
          fTime: 0,
          Breakfast: 'Not available',
          Lunch: 'Not available',
          Dinner: 'Not available',
          diet: 'No plan available.',
        };
    }
  };

  const { cTime, sTime, fTime, Breakfast, Lunch, Dinner } = getPlan();

  const plan = {
    userId: userId,
    category,
    days: [
      {
        workouts: [
          {
            type: 'Cardio',
            duration: cTime,
          },
          {
            type: 'Strength',
            duration: sTime,
          },
          {
            type: 'Flexibility',
            duration: fTime,
          },
        ],
        Meal: [
          {
            type: 'Breakfast',
            description: Breakfast,
          },
          {
            type: 'Lunch',
            description: Lunch,
          },
          {
            type: 'Dinner',
            description: Dinner,
          },
        ],
      },
    ],
  };


  const handleAddToPlan = async () => {
    setIsLoading(true);
    if (plan) {
      try {
        // Attempt to create the plan

        await createPlan(plan);
        Alert.alert('Added to Plan');
        setIsLoading(false);
        // Navigate to the WorkoutHome screen upon success
        navigation.navigate('Physical Health Home');
      } catch (error) {
        // Handle any errors that occurred during the request
        console.log('Error adding to plan:', error);
        setIsLoading(false);
        alert('Error: Unable to add plan. You have already Plan.');
      }
    } else {
      // If the plan is not filled, show an alert
      setIsLoading(false);
      Alert.alert('Error: Please fill in all required fields.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#eeeeee" />
        <Text style={styles.loadingText}>Loading workout plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* Workout Plan */}
        <ImageBackground
          source={require('../assets/images/Work.jpg')}
          style={styles.planContainer}
          imageStyle={styles.imageBackground}
        >
          <View style={styles.planHeader}>
            <Text style={styles.sectionHeader}>Workout Plan</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('EditWorkoutPlanScreen', {
                  cardioTime: cTime,
                  strengthTime: sTime,
                  flexibilityTime: fTime,
                })
              }
            >
              <MaterialIcons name="edit" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Cardio</Text>
            <Text style={styles.planSubText}>{cTime} mins of running.</Text>
          </View>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Strength</Text>
            <Text style={styles.planSubText}>
              {sTime} mins of weight lifting.
            </Text>
          </View>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Flexibility</Text>
            <Text style={styles.planSubText}>{fTime} mins of yoga.</Text>
          </View>
        </ImageBackground>

        {/* Dietary Recommendations */}
        <ImageBackground
          source={require('../assets/images/MealPlan.jpg')}
          style={styles.planContainer}
          imageStyle={styles.imageBackground}
        >
          <View style={styles.planHeader}>
            <Text style={styles.sectionHeader}>Dietary Recommendations</Text>
          </View>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Breakfast</Text>
            <Text style={styles.planSubText}>{Breakfast}.</Text>
          </View>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Lunch</Text>
            <Text style={styles.planSubText}>{Lunch}.</Text>
          </View>
          <View style={styles.planItem}>
            <Text style={styles.planText}>Dinner</Text>
            <Text style={styles.planSubText}>{Dinner}.</Text>
          </View>
        </ImageBackground>

        {/* Confirm Plan Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleAddToPlan}
        >
          <Text style={styles.confirmButtonText}>Confirm Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#1c1c1e',
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
  },
  loadingText: {
    marginTop: 10,
    color: '#fefefe',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1c1c1e',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  planContainer: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  imageBackground: {
    borderRadius: 12,
    opacity: 0.7,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF5722',
  },
  planItem: {
    marginTop: 10,
  },
  planText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fdd8ca',
  },
  planSubText: {
    fontSize: 14,
    color: '#e4e4e4',
    marginTop: 5,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PersonalizedPlanScreen;
