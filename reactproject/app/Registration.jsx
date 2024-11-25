// /src/screens/Registration.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { router } from "expo-router";
import { images } from '../constants';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Optional: Password strength validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true); // Start loading

      const response = await fetch('http://192.168.42.99:5000/register', {

        // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      setLoading(false); // Stop loading

      if (response.ok) {
        Alert.alert('Registration Successful', 'You have registered successfully!', [
          { text: 'OK', onPress: () => router.push('/Login') }
        ]);
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Registration Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false); // Stop loading
      Alert.alert('Error', 'Failed to connect to the server');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={images.uniwell}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Register</Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
          mode="flat"
          theme={{ colors: { primary: '#F2592B', text: '#FFF2D7', placeholder: '#FFF2D7' } }} // Change label, text, and placeholder colors
      
          left={<TextInput.Icon name="account" />}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
          style={styles.input}
          mode="flat"
          theme={{ colors: { primary: '#F2592B', text: '#FFF2D7', placeholder: '#FFF2D7' } }} // Change label, text, and placeholder colors
      
          autoCapitalize="none"
          left={<TextInput.Icon name="email" />}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.input}
          mode="flat"
          theme={{ colors: { primary: '#F2592B', text: '#FFF2D7', placeholder: '#FFF2D7' } }} // Change label, text, and placeholder colors
      
          left={<TextInput.Icon name="lock" />}
        />

        {loading ? (
          <ActivityIndicator animating={true} color={'#FBA423'} style={styles.loader} />
        ) : (
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>
        )}

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/Login')}
        >
          <Text style={styles.loginText}>Already registered? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFF2D7',
    fontSize: 26,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFF2D7',
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF5722',
    paddingVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#FBA423',
    fontSize: 16,
  },
});
