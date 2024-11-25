import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import * as FileSystem from 'expo-file-system'; // Import FileSystem to handle file operations

const screenWidth = Dimensions.get('window').width - 40; // Adjust for padding

const SleepAnalytics = () => {
  const [sleepLogs, setSleepLogs] = useState([]);
  const [averageSleep, setAverageSleep] = useState(0);
  const [sleepDurations, setSleepDurations] = useState([]);
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSleepLogs();
  }, []);

  useEffect(() => {
    if (sleepLogs.length > 0) {
      calculateAverageSleep();
      prepareChartData();
    }
  }, [sleepLogs]);

  const loadSleepLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem('sleepLogs');
      if (storedLogs !== null) {
        const parsedLogs = JSON.parse(storedLogs);
        // Sort logs by date ascending
        parsedLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
        setSleepLogs(parsedLogs);
      }
    } catch (error) {
      console.error('Failed to load sleep logs for analytics', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageSleep = () => {
    const totalMinutes = sleepLogs.reduce((acc, log) => {
      const [hours, minutes] = log.duration.split('h ');
      return acc + parseInt(hours) * 60 + parseInt(minutes.replace('m', ''));
    }, 0);
    const avgMinutes = totalMinutes / sleepLogs.length;
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = Math.round(avgMinutes % 60);
    setAverageSleep(`${avgHours}h ${avgMins}m`);
  };

  const prepareChartData = () => {
    const last7DaysLogs = sleepLogs.slice(-7); // Get last 7 sleep logs
    const chartLabels = last7DaysLogs.map((log) => moment(log.date).format('MMM D'));
    const chartData = last7DaysLogs.map((log) => {
      const [hours, minutes] = log.duration.split('h ');
      return parseInt(hours) + parseInt(minutes.replace('m', '')) / 60;
    });
    setDates(chartLabels);
    setSleepDurations(chartData);
  };

  const generateReport = async () => {
    const reportContent = `Sleep Analytics Report\n\nAverage Sleep Duration: ${averageSleep}\n\nSleep Durations:\n` +
      sleepLogs.map(log => `${moment(log.date).format('MMM D')}: ${log.duration}`).join('\n');

    // Create a file in the filesystem
    const fileUri = `${FileSystem.documentDirectory}SleepAnalyticsReport.txt`;
    await FileSystem.writeAsStringAsync(fileUri, reportContent);

    // Share the report
    await Share.share({
      url: fileUri,
      message: 'Here is your sleep analytics report!',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Sleep Data...</Text>
      </View>
    );
  }

  if (sleepLogs.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No sleep logs available for analytics.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Sleep Analytics</Text>

      {/* Average Sleep Duration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Average Sleep Duration</Text>
        <Text style={styles.averageText}>{averageSleep}</Text>
      </View>

      {/* Sleep Duration Trends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Duration Over Last 7 Days</Text>
        <LineChart
          data={{
            labels: dates,
            datasets: [
              {
                data: sleepDurations,
              },
            ],
          }}
          width={screenWidth}
          height={220}
          yAxisSuffix="h"
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </View>

      {/* Report Generation Button */}
      <TouchableOpacity style={styles.button} onPress={generateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#1A1A1A',
  backgroundGradientTo: '#1A1A1A',
  decimalPlaces: 1, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#4CAF50',
  },
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  averageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1A1A1A',
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SleepAnalytics;
