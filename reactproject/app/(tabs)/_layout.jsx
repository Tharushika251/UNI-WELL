import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants'; // Ensure the path to icons is correct

// Custom Tab Icon component
const TabIcon = ({ icon, color }) => {
  return (
    <View className="flex items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: 40, height: 40, tintColor: color }} // Apply tintColor for icon color
      />
    </View>
  );
};

// Main layout component for bottom tabs
const _layout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FF5722', // Active icon color
          tabBarInactiveTintColor: '#B0BEC5', // Inactive icon color
          tabBarStyle: {
            backgroundColor: '#100d0c', // Dark background color
            borderTopWidth: 1,
            borderTopColor: '#0b0b0c',
            height: 70,
            elevation: 10, // Shadow for Android
            paddingTop: 20, // Padding at the top
            shadowColor: '#000', // Shadow color for iOS
            shadowOffset: {
              width: 0,
              height: 3, // Vertical shadow offset
            },
            shadowOpacity: 0.2, // Shadow opacity
            shadowRadius: 5, // Shadow blur radius
          },
        }}
      >
        {/* mentalhealthhome Tab */}
        <Tabs.Screen
          name="mentalhealthhome" // Matches the file app/profile.js
          options={{
            tabBarShowLabel: false,
            title: 'Mental Health Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon
                icon={icons.psychology} // Profile icon
                color={color}
              />
            ),
          }}
        />
        
        {/* sleephome Tab */}
        <Tabs.Screen
          name="sleephome" // Matches the file app/create.js
          options={{
            tabBarShowLabel: false,
            title: 'Sleep Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon
                icon={icons.night} // Upload icon
                color={color}
              />
            ),
          }}
        />

        {/* home Tab */}
        <Tabs.Screen
          name="home" // Matches the file app/bookmark.js
          options={{
            tabBarShowLabel: false,
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon
                icon={icons.medicalrecords} // Bookmark icon
                color={color}
              />
            ),
          }}
        />

        {/* physicalhome Tab */}
        <Tabs.Screen
          name="physicalhome" // Matches the file app/home.js
          options={{
            tabBarShowLabel: false,
            title: 'Physical Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon
                icon={icons.fitness} // Home icon
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _layout;

const styles = StyleSheet.create({});
