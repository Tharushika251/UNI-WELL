import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

export default function MentalHealthHome() {
  const [weeklyData, setWeeklyData] = useState({
    routinesCompleted: 0,
    moodPatterns: [],
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          fetchWeeklySummary(id);
        } else {
          console.error('User ID not found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchWeeklySummary = async (id) => {
    try {
      const response = await fetch(
        `http://192.168.92.24:5000/weekly-summary/${id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weekly summary.');
      }
      const data = await response.json();
      setWeeklyData(data);
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    }
  };

  // Prepare data for the chart
  const moodData = weeklyData.moodPatterns.map((mood) => {
    if (mood === 'Happy') return 1;
    if (mood === 'Neutral') return 2;
    if (mood === 'Stressed') return 3;
    return 0;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Mental Health </Text>

      {/* Meditation Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Meditation</Text>
        <Image
          style={styles.image}
          source={require('./assets/meditation_placeholder.png')} // Ensure you have this image in assets folder
        />
        <TouchableOpacity
          style={styles.meditationButton}
          onPress={() =>
            Alert.alert('Meditation', 'Start your meditation session')
          }
        >
          <Text style={styles.meditationButtonText}>Start Meditation</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Mood Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Weekly Mood Summary</Text>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                data: moodData.length ? moodData : [0, 0, 0, 0, 0, 0, 0],
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="Mood"
          yLabelsOffset={5}
          chartConfig={{
            backgroundGradientFrom: '#ff9f43',
            backgroundGradientTo: '#ff6b6b',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.5,
            decimalPlaces: 1,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
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
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  meditationButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  meditationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
});
