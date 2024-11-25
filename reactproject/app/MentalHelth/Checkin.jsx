import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

export default function Checkin() {
  const [userId, setUserId] = useState(null);
  const [checkin, setCheckin] = useState({ anxiety: 5, stress: 5 });
  const [maxCheckinsReached, setMaxCheckinsReached] = useState(false);
  const [checkinDisabled, setCheckinDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for button feedback
  const MAX_CHECKINS = 3;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert('Error', 'User ID not found. Please log in.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user ID');
      }
    };

    fetchUserId();
  }, []);

  const submitCheckin = async () => {
    setLoading(true); // Start loading
    const today = new Date().toDateString();
    const storedCheckins =
      JSON.parse(await AsyncStorage.getItem('checkins')) || {};
    const todaysCheckins = storedCheckins[today] || [];

    if (todaysCheckins.length >= MAX_CHECKINS) {
      setMaxCheckinsReached(true);
      Alert.alert('Error', 'You have reached the maximum check-ins for today.');
      setLoading(false);
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID is not available.');
      setLoading(false);
      return;
    }

    setCheckinDisabled(true);

    const mood =
      checkin.anxiety > 7 ? 'Happy' : checkin.anxiety > 4 ? 'Neutral' : 'Sad';

    try {
      const response = await fetch(
        'http://192.168.92.24:5000/checkins/submit',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...checkin, userId, mood }),
        }
      );

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        console.log('Raw response:', responseText);
        Alert.alert('Error', 'Invalid response format from the server.');
        setLoading(false);
        return;
      }

      if (response.ok) {
        Alert.alert('Check-in Submitted', data.message);
        todaysCheckins.push(new Date().toISOString());
        storedCheckins[today] = todaysCheckins;
        await AsyncStorage.setItem('checkins', JSON.stringify(storedCheckins));
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error submitting check-in:', error);
      Alert.alert(
        'Error',
        'Failed to submit check-in. Please check your network connection.'
      );
    } finally {
      setLoading(false); // End loading
      setTimeout(() => {
        setCheckinDisabled(false);
      }, 10000); // Wait 10 seconds before re-enabling the button
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mental Health Check-In</Text>

      {/* Anxiety Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Anxiety: {checkin.anxiety}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={checkin.anxiety}
          onValueChange={(value) => setCheckin({ ...checkin, anxiety: value })}
          minimumTrackTintColor="#FF6B6B"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#FF6B6B"
        />
      </View>

      {/* Stress Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Stress: {checkin.stress}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={checkin.stress}
          onValueChange={(value) => setCheckin({ ...checkin, stress: value })}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#4CAF50"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.button,
          (checkinDisabled || maxCheckinsReached || loading) &&
            styles.buttonDisabled,
        ]}
        onPress={submitCheckin}
        disabled={checkinDisabled || maxCheckinsReached || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Check-In</Text>
        )}
      </TouchableOpacity>

      {/* Error Message for Max Check-ins */}
      {maxCheckinsReached && (
        <Text style={styles.errorText}>Max check-ins reached for today.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  sliderContainer: {
    width: '80%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
  },
  button: {
    backgroundColor: '#ee3b00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
});
