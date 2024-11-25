import React from 'react';
import { StyleSheet, Text, View, Image, Alert, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


export default function MentalHealthHome() {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mental Health</Text>

      {/* Meditation Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Meditation</Text>
        <Image
          style={styles.image}
          source={require('./assets/meditation_placeholder.png')} // Ensure you have this image in assets folder
        />
<TouchableOpacity
  style={styles.card}
  onPress={() => navigation.navigate('MeditationScreen')}
>
  <Text style={styles.cardText}>Start Meditation</Text>
</TouchableOpacity>

      </View>

      {/* Dashboard Cards */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Checkin')}
      >
        <Text style={styles.cardText}>Check In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Routines')}
      >
        <Text style={styles.cardText}>Routines</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('WeeklySummary')}
      >
        <Text style={styles.cardText}>Weekly Report Summary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CBTExercises')}
      >
        <Text style={styles.cardText}>CBT Exercises</Text>
      </TouchableOpacity>

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  card: {
    backgroundColor: '#2A2A2A',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerSpace: {
    height: 50,
  },
});
