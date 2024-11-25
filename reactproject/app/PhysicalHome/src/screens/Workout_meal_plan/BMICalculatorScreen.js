import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { AddBMI } from '../../server/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from 'react-native-vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

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

const BMICalculatorScreen = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [category, setCategory] = useState('');
  const navigation = useNavigation();
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

  const handleBMI = async () => {
    const newBMI = {
      userId,
      weight,
      height,
      bmi,
    };

    if (AddBMI) {
      await AddBMI(newBMI);
      console.log('Added to BMI');
    } else {
      alert('Error: Please fill in all required fields.');
    }
  };

  useEffect(() => {
    if (bmi) {
      determineCategory(bmi);
      handleBMI();
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

  const calculatePosition = (bmi) => {
    const margin = 25; // Add some margin from both sides of the screen
    const totalWidth = width - margin * 2; // Calculate the total width excluding margin
    let position = 0;

    if (bmi < 18.5) {
      // Underweight (interpolating between 0 and 18.5)
      position = (bmi / 18.5) * (totalWidth * 0.25);
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      // Normal weight (interpolating between 18.5 and 24.9)
      position =
        totalWidth * 0.25 +
        ((bmi - 18.5) / (24.9 - 18.5)) * (totalWidth * 0.25);
    } else if (bmi >= 25 && bmi <= 29.9) {
      // Overweight (interpolating between 25 and 29.9)
      position =
        totalWidth * 0.5 + ((bmi - 25) / (29.9 - 25)) * (totalWidth * 0.25);
    } else if (bmi >= 30) {
      // Obesity (interpolating for BMI values above 30)
      position =
        totalWidth * 0.75 + ((bmi - 30) / (50 - 30)) * (totalWidth * 0.25);
    }

    return position + margin; // Return the position plus the margin
  };

  const calculateBMI = () => {
    if (weight && height && selectedGender) {
      const bmiValue = (
        parseFloat(weight) /
        (parseFloat(height) / 100) ** 2
      ).toFixed(1);
      setBmi(bmiValue);
      Keyboard.dismiss();
    } else {
      Alert.alert('Fill All Inputs');
    }
  };

  console.log(category);

  const navigateToPlan = () => {
    if (category) {
      // Ensure both BMI and category are available before navigating
      navigation.navigate('PersonalizedPlan', { category });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>BMI Calculator</Text> */}

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'male' && styles.selectedGender,
          ]}
          onPress={() => setSelectedGender('male')}
        >
          <FontAwesome
            name="male"
            size={28}
            color={selectedGender === 'male' ? '#f9f9f9' : '#ffffff'}
            style={styles.icon}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === 'male' && styles.selectedGenderText,
            ]}
          >
            MALE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === 'female' && styles.selectedGender,
          ]}
          onPress={() => setSelectedGender('female')}
        >
          <FontAwesome
            name="female"
            size={28}
            color={selectedGender === 'female' ? '#ffffff' : '#ffffff'}
            style={styles.icon}
          />
          <Text
            style={[
              styles.genderText,
              selectedGender === 'female' && styles.selectedGenderText,
            ]}
          >
            FEMALE
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weight & Height Inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>WEIGHT (Kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.label}>HEIGHT (Cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.content}>
          <Text style={styles.resultText}>Your BMI</Text>
          <View style={styles.resultBox}>
            <Text style={styles.bmiText}>{bmi}</Text>
            <Text style={styles.bmiText}>{category}</Text>
          </View>

          <View style={styles.bmiRangeContainer}>
            <Svg height="40" width={width - 50}>
              {/* Range Indicator */}
              <Rect x="0" y="0" width={width / 4} height="20" fill="blue" />
              <Rect
                x={width / 4}
                y="0"
                width={width / 4}
                height="20"
                fill="green"
              />
              <Rect
                x={(width / 4) * 2}
                y="0"
                width={width / 4}
                height="20"
                fill="yellow"
              />
              <Rect
                x={(width / 4) * 3}
                y="0"
                width={width / 4}
                height="20"
                fill="red"
              />

              {/* Triangle Indicator */}
              <View style={{ position: 'relative' }}>
                <CaretDownIcon
                  style={{
                    position: 'absolute',
                    left: calculatePosition(bmi), // Set the horizontal position dynamically
                    top: -43, // Adjust the vertical position as needed
                  }}
                />
              </View>
            </Svg>
          </View>

          <Text style={styles.bmiInfo}>
            BMI, or Body Mass Index, is a measure that uses your height and
            weight to determine if your weight is healthy.
          </Text>
        </View>
      )}

      {bmi && (
        <View>
          <TouchableOpacity style={styles.navButton} onPress={navigateToPlan}>
            <Text style={styles.buttonText}>Get Plan</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171212',
    padding: 20,
  },
  content: {
    backgroundColor: '#3c2b23',
    paddingBottom: 1,
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#8D6E63',
  },
  genderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop:8,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputBox: {
    flex: 1,
    marginHorizontal: 10,
  },
  label: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    color: '#FFF',
    textAlign: 'center',
  },
  calculateButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultBox: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  bmiText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bmiRangeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bmiInfo: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 60,
  },
});

export default BMICalculatorScreen;
