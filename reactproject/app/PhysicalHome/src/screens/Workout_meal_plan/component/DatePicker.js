import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import moment from 'moment';

const DatePicker = ({ onDateSelect, startDate, workouts }) => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  );
  const flatListRef = useRef(null);

  const days = Array.from({ length: 7 }, (_, i) =>
    moment(startDate).add(i, 'days')
  );

  useEffect(() => {
    // Scroll to the selected date
    const index = days.findIndex(
      (day) => day.format('YYYY-MM-DD') === selectedDate
    );
    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [selectedDate, startDate]);

  const selectDate = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    onDateSelect(date);
  };

  const renderItem = ({ item }) => {
    const isSelected = item.format('YYYY-MM-DD') === selectedDate;
    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
        onPress={() => selectDate(item)}
      >
        <Text style={styles.dayText}>{item.format('dd')}</Text>
        <Text style={styles.dateText}>{item.format('D')}</Text>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 60, // Height of each item
    offset: 60 * index, // Height of each item multiplied by the index
    index,
  });

  const handleScrollToIndexFailed = (info) => {
    // Handle scrolling failures here, such as by scrolling to the start or end
    console.warn('Scroll to index failed', info);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={days}
        renderItem={renderItem}
        keyExtractor={(item) => item.format('YYYY-MM-DD')}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datePicker}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#472B24',
    borderRadius: 10,
    paddingVertical: 2,
  },
  datePicker: {
    backgroundColor: '#472B24',
    borderRadius: 10,
    paddingVertical: 5,
  },
  dateItem: {
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#472B24',
    height: 90,
    width: 60,
    justifyContent: 'center',
  },
  selectedDateItem: {
    backgroundColor: '#F36439',
    shadowColor: '#000',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    height: 90,
    width: 60,
  },
  dayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DatePicker;
