import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { AddBMI, getLatestBMI } from '../../../server/api';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CaretDownIcon = ({ size = 80, color = '#ff5101', style }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path
        d="M7 10l5 5 5-5H7z" // This path creates a downward arrow shape
        fill={color}
      />
    </Svg>
  );
};

const { width } = Dimensions.get('window');

export default function BMICardHome() {
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
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
        const response = await getLatestBMI(userId);
        const data = response.data;
        setBMI(data.bmi);
      } catch (error) {
        console.log('Error fetching BMI data:', error);
      }
    };
    fetchBMIData();
  }, [modalVisible, bmi, userId]);

  useEffect(() => {
    if (bmi) {
      determineCategory(bmi);
    }
  }, [bmi]);

  const determineCategory = (bmiValue) => {
    let bmiCategory = '';
    if (bmiValue < 18.5) {
      bmiCategory = 'Underweight';
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      bmiCategory = 'Normal Weight';
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      bmiCategory = 'Overweight';
    } else if (bmiValue >= 30) {
      bmiCategory = 'Obesity';
    }
    setCategory(bmiCategory);
  };

  // Adjust the position of the triangle marker based on BMI
  const calculatePosition = (bmi) => {
    const minBMI = 0;
    const maxBMI = 40; // Max BMI we are considering in the scale
    const minPosition = 0;
    const maxPosition = width - 50;

    const clampedBMI = Math.max(minBMI, Math.min(bmi, maxBMI));
    return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * maxPosition;
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setWeight('');
    setHeight('');
  };

  const handleBMICalculation = () => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const newBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBMI(newBMI);
      determineCategory(newBMI);
      handleBMI(newBMI); // Pass the new BMI value
      closeModal();
    } else {
      alert('Please enter both weight and height');
    }
  };

  const handleBMI = async (newBMI) => {
    const bmiData = {
      userId,
      weight,
      height,
      bmi: newBMI,
    };

    if (newBMI && weight && height) {
      await AddBMI(bmiData);
      console.log('Added to BMI');
    } else {
      alert('Error: Please fill in all required fields.');
    }
  };

  return (
    <>
      <Text style={styles.resultText}>Your Body Mass Index</Text>
      <TouchableOpacity style={styles.editIcon} onPress={openModal}>
        <MaterialIcons name="edit" size={24} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.resultBox}>
        <Text style={styles.bmiText}>{bmi || 'N/A'}</Text>
      </View>

      <View style={styles.bmiRangeContainer}>
        <Svg height="40" width={width - 50}>
          <Rect x="0" y="0" width={(width - 50) / 4} height="20" fill="blue" />
          <Rect
            x={(width - 50) / 4}
            y="0"
            width={(width - 50) / 4}
            height="20"
            fill="green"
          />
          <Rect
            x={(width - 50) / 2}
            y="0"
            width={(width - 50) / 4}
            height="20"
            fill="yellow"
          />
          <Rect
            x={(width - 50) * 0.75}
            y="0"
            width={(width - 50) / 4}
            height="20"
            fill="red"
          />
          {bmi && !isNaN(bmi) && (
            <View style={{ position: 'relative' }}>
              <CaretDownIcon
                style={{
                  position: 'absolute',
                  left: calculatePosition(bmi), // Set the horizontal position dynamically
                  top: -43, // Adjust the vertical position as needed
                }}
              />
            </View>
          )}
        </Svg>
      </View>
      <Text style={styles.bmicat}>{category}</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Calculate BMI</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight (kg)"
              keyboardType="numeric"
              value={weight}
              onChangeText={(text) => setWeight(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter height (cm)"
              keyboardType="numeric"
              value={height}
              onChangeText={(text) => setHeight(text)}
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={handleBMICalculation}
            >
              <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultBox: {
    padding: 4,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
  },
  bmiText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  bmicat: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  bmiRangeContainer: {
    alignItems: 'center',
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#3d3836',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
  },
  calculateButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#bfbfbf',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
