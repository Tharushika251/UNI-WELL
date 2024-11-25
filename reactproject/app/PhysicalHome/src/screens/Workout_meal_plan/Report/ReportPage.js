import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import WorkoutGraph from './WorkoutGraph';
import BMIGraph from './BMIGraph';

function ReportPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.graphContainer}>
        <WorkoutGraph />
      </View>
      <View style={styles.graphContainer}>
        <BMIGraph />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a',
  },
  graphContainer: {
    backgroundColor: '#272A35',
    marginBottom: 16,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginLeft:7,
  },
});

export default ReportPage;
