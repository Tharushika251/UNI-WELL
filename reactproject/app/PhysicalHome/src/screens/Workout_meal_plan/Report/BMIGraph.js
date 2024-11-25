import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { getBMI } from '../../../server/api';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BMIGraph = () => {
  const [bmiData, setBmiData] = useState([]);
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
    // Fetching data from your MongoDB API
    const fetchBMIData = async () => {
      try {
        const response = await getBMI(userId);
        const data = response.data;
        setBmiData(data);
        filterData(data, '7days'); // Filter data on initial load
      } catch (error) {
        console.error('Error fetching BMI data:', error);
      }
    };
    fetchBMIData();
  }, [userId]);

  // Function to filter data based on the selected period
  const filterData = (data, period) => {
    const now = moment();
    let filtered;

    if (period === '7days') {
      filtered = data.filter((item) =>
        moment(item.addDate).isAfter(now.subtract(7, 'days'))
      );
    } else if (period === '1month') {
      filtered = data.filter((item) =>
        moment(item.addDate).isAfter(now.subtract(1, 'months'))
      );
    } else if (period === '1year') {
      filtered = data.filter((item) =>
        moment(item.addDate).isAfter(now.subtract(1, 'years'))
      );
    }

    setFilteredData(filtered);
    setFilter(period);
  };

  // Preparing data for the chart
  const chartData = filteredData.map((item) => ({
    value: item.bmi,
    label: moment(item.addDate).format('MMM-DD'),
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>BMI Progress</Text>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === '7days' && styles.activeFilter,
          ]}
          onPress={() => filterData(bmiData, '7days')}
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
          onPress={() => filterData(bmiData, '1month')}
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
          onPress={() => filterData(bmiData, '1year')}
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

      {/* Displaying the Line Chart */}
      {filteredData.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            areaChart
            data={chartData}
            maxValue={60}
            hideRules
            startFillColor="rgb(255, 98, 46)"
            startOpacity={0.8}
            endFillColor="rgb(255, 163, 87)"
            endOpacity={0.3}
            curved
            spacing={50}
            yAxisTextStyle={{ color: '#f4f4f4' }}
            xAxisLabelTextStyle={{ color: 'white', fontSize: 12 }}
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={5}
            color="rgb(255, 128, 23)"
            dataPointsColor="rgb(251, 105, 1)"
            dataPointsRadius={7}
            hideDataPoints={false}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 2,
              pointerColor: 'rgb(251, 80, 1)',
              radius: 7,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: (items) => {
                return (
                  <View
                    style={{
                      height: 90,
                      width: 100,
                      justifyContent: 'center',
                      marginTop: -30,
                      marginLeft: -40,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        marginBottom: 6,
                        textAlign: 'center',
                      }}
                    >
                      {items[0].date}
                    </Text>

                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        borderRadius: 16,
                        backgroundColor: 'white',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {items[0].value}
                      </Text>
                    </View>
                  </View>
                );
              },
            }}
          />
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 5,
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
  chartContainer: {
    marginTop: 10,
    backgroundColor: '#472B24',
    borderRadius: 30,
    padding: 10,
    shadowColor: '#504242',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  loadingText: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
    fontSize: 18,
  },
});

export default BMIGraph;
