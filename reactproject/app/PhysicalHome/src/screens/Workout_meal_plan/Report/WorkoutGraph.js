import React, { useEffect, useState } from 'react';
import { getQuiz } from '../../../server/api';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WorkoutGraph() {
  const [quizData, setQuizData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('7days'); // Default filter is 'Last 7 Days'
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

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getQuiz(userId);
        const data = response.data;
        setQuizData(data);
        applyFilter(data, '7days'); // Apply the default filter on initial load
      } catch (error) {
        console.error('Error fetching Quiz data:', error);
      }
    };
    fetchQuizData();
  }, [userId]);

  const applyFilter = (data, period) => {
    const now = moment();
    let filtered;

    if (period === '7days') {
      filtered = data.filter((item) =>
        moment(item.onDate).isAfter(now.subtract(7, 'days'))
      );
    } else if (period === '1month') {
      filtered = data.filter((item) =>
        moment(item.onDate).isAfter(now.subtract(1, 'months'))
      );
    } else if (period === '1year') {
      filtered = data.filter((item) =>
        moment(item.onDate).isAfter(now.subtract(1, 'years'))
      );
    }

    setFilteredData(filtered);
    setFilter(period);
  };

  const transformDataForChart = () => {
    return filteredData
      .map((item) => {
        if (!item.cardioTime || !item.strengthTime || !item.flexibilityTime) {
          console.warn('Invalid workout data detected:', item);
          return [];
        }
        return [
          {
            value: item.cardioTime,
            label: moment(item.onDate).format('MMM-DD'),
            spacing: 2, // Keep spacing as needed
            labelWidth: 50,
            labelTextStyle: { color: 'white' },
            frontColor: '#8979FF',
          },
          {
            value: item.strengthTime,
            frontColor: '#FF928A',
            spacing: 2, // Remove extra spacing for strengthTime bar
          },
          {
            value: item.flexibilityTime,
            frontColor: '#3CC3DF',
            spacing: 20, // Remove extra spacing for flexibilityTime bar
          },
        ];
      })
      .flat();
  };

  const renderTitle = () => {
    return (
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, { backgroundColor: '#8979FF' }]}
          />
          <Text style={styles.legendText}>Cardio</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, { backgroundColor: '#FF928A' }]}
          />
          <Text style={styles.legendText}>Strength</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColorBox, { backgroundColor: '#3CC3DF' }]}
          />
          <Text style={styles.legendText}>Flexibility</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Workout Progress</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === '7days' && styles.activeFilter,
          ]}
          onPress={() => applyFilter(quizData, '7days')}
        >
          <Text
            style={[
              styles.filterText,
              filter === '7days' && styles.activeFilterText,
            ]}
          >
            Last 7 Days
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === '1month' && styles.activeFilter,
          ]}
          onPress={() => applyFilter(quizData, '1month')}
        >
          <Text
            style={[
              styles.filterText,
              filter === '1month' && styles.activeFilterText,
            ]}
          >
            Last 1 Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === '1year' && styles.activeFilter,
          ]}
          onPress={() => applyFilter(quizData, '1year')}
        >
          <Text
            style={[
              styles.filterText,
              filter === '1year' && styles.activeFilterText,
            ]}
          >
            Last 1 Year
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        {renderTitle()}
        <BarChart
          data={transformDataForChart()}
          barWidth={14}
          spacing={10}
          roundedTop
          roundedBottom
          hideRules
          hideDataPoints={false}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: '#fffefe' }}
          noOfSections={7}
          maxValue={70}
          isAnimated
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  chartContainer: {
    backgroundColor: '#472B24',
    borderRadius: 30,
    padding: 20,
    shadowColor: '#504242',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: 'white',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#555',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#fff',
  },
  activeFilter: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  loadingText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
    fontSize: 18,
  },
});

export default WorkoutGraph;
