import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { images } from '../../constants';
import { useNavigation } from '@react-navigation/native'; 
import { router } from "expo-router";

const Home = () => {
  const navigation = useNavigation(); 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={images.uniwell}
        resizeMode="contain"
      />

      {/* First Clickable Area */}
      <TouchableOpacity style={styles.area1} onPress={() => router.push('../(healthinsight)/create')}>
        <Image source={images.waterdrop} style={styles.image} />
        <Text style={styles.buttonText}>Water Intake</Text>
      </TouchableOpacity>

      {/* Second Clickable Area */}
      <TouchableOpacity style={styles.area2} onPress={() => router.push('../(healthinsight)/profile')}>
        <Image source={images.diet} style={styles.image} />
        <Text style={styles.buttonText}>Diet Tracker</Text>
      </TouchableOpacity>

      {/* Third Clickable Area */}
      <TouchableOpacity style={styles.area3} onPress={() => router.push('../(healthinsight)/bookmark')}>
        <Image source={images.drugs} style={styles.image} />
        <Text style={styles.buttonText}>Medicine Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginVertical: 20, // Space around the logo
    alignSelf: 'flex-start',
    marginLeft:27,
  },
  area1: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20, // Adds spacing between elements
  },
  area2: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  area3: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
});
