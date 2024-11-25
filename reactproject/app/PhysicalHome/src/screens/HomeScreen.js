import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('BMI Calculator')}
      >
        <Text style={styles.buttonText}>BMI Calculator</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Datapick')}
      >
        <Text style={styles.buttonText}>Datapick</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Workout')}
      >
        <Text style={styles.buttonText}>Workout</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('WorkoutHome')}
      >
        <Text style={styles.buttonText}>Workout</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('bmiGraph')}
      >
        <Text style={styles.buttonText}>BMI</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('MealPlanScreen')}
      >
        <Text style={styles.buttonText}>Meal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('quizGraph')}
      >
        <Text style={styles.buttonText}>Graph</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Report Summery')}
      >
        <Text style={styles.buttonText}>Report Summery</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default HomeScreen;
