import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { images } from '../constants';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Check if fields are filled
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await fetch('http://192.168.100.135:5000/login', {
        // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false); // Stop loading

      if (response.ok) {
        Alert.alert('Login Successful', 'You have logged in successfully!');

        // Save user ID to AsyncStorage
        await AsyncStorage.setItem('userId', data.userId);
        console.log(data.userId);

        // Navigate to the home page
        router.push('/home');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false); // Stop loading
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={images.uniwell} resizeMode="contain" />
      <Text style={styles.title}>Login</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        style={styles.input}
        mode="flat"
        theme={{
          colors: {
            primary: '#F2592B',
            text: '#FFF2D7',
            placeholder: '#FFF2D7',
          },
        }} // Change label, text, and placeholder colors
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        mode="flat"
        theme={{
          colors: {
            primary: '#F2592B',
            text: '#FFF2D7',
            placeholder: '#FFF2D7',
          },
        }} // Change label, text, and placeholder colors
      />

      {loading ? (
        <ActivityIndicator animating={true} color={'#000'} />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          {' '}
          {/* Change logged to handleLogin */}
          Login
        </Button>
      )}
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push('./Registration')}
      >
        <Text style={styles.loginText}>
          Don't have account ? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 35,
    textAlign: 'center',
    color: '#FFF2D7',
    fontSize: 35,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFF2D7',
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    color: '#FFF2D7',
    backgroundColor: '#FF5722',
    marginBottom: 120,
  },
  logo: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    alignSelf: 'center', // Center the logo
    marginBottom: 40, // Add space below the logo
  },
  loginLink: {
    marginTop: 1,
    alignItems: 'center',
  },
  loginText: {
    color: '#FBA423',
    fontSize: 16,
  },
});
