import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import BMICardHome from './component/BMICardHome';

const HomeFitnessDietaryPlan = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Workout Plan Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Workout Plan')}
      >
        <Image
          source={require('../assets/images/homeWorkPlan.jpg')} // Replace with your actual image URL or local asset
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>Workout Plan</Text>
          <TouchableOpacity
            style={styles.myPlanButton}
            onPress={() => navigation.navigate('Workout Plan')}
          >
            <Text style={styles.myPlanText}>My Plan</Text>
            <AntDesign
              name="rightcircleo"
              size={26}
              style={{ marginRight: 10, marginLeft: 20 }}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Meal Plan Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Meal Plan')}
      >
        <Image
          source={require('../assets/images/MealPlan.jpg')}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Text style={styles.cardTitle}>Meal Plan</Text>
          <TouchableOpacity
            style={styles.myPlanButton}
            onPress={() => navigation.navigate('Meal Plan')}
          
            ><Text style={styles.myPlanText}>My Plan</Text>
            <AntDesign
              name="rightcircleo"
              size={26}
              style={{ marginRight: 10, marginLeft: 20 }}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* BMI Indicator */}
      <View style={styles.bmiContainer}>
        <BMICardHome />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f', // Dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    color: '#fff',
    fontSize: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 2,
    margin:10,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: '100%',
    padding: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    position: 'relative',
    margin: 10,
    top: -50,
  },
  myPlanButton: {
    backgroundColor: '#3c2b23',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: 150,
    height: 45,
  },
  myPlanText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bmiContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 50,
    padding: 16,
    backgroundColor: '#3c2b23', // Dark brown background
    borderRadius: 12,
    alignItems: 'center',
  },
  bmiLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  bmiValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  bmiBarContainer: {
    height: 10,
    borderRadius: 50,
    width: '100%',
    backgroundColor: '#ccc',
    marginTop: 16,
    position: 'relative',
  },
  bmiBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 50,
    width: '75%', // Adjust this width to match the BMI value
  },
  bmiPointer: {
    position: 'absolute',
    height: '100%',
    width: 4,
    backgroundColor: '#2196f3', // Blue pointer
    left: '75%', // Adjust the pointer position to match the BMI value
    borderRadius: 50,
  },
  bmiCategory: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default HomeFitnessDietaryPlan;
