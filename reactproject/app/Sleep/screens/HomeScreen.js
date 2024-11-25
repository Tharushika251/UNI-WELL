// HomeScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons or any icon library

const HomeScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Goals')}>
                    <Icon name="flag" size={30} color="#FFD700" />
                    <Text style={styles.cardText}>Goals</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ManualSleepLogging')}>
                    <Icon name="bed-outline" size={30} color="#ADD8E6" />
                    <Text style={styles.cardText}>Sleep Logging</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SleepAnalytics')}>
                    <Icon name="bar-chart" size={30} color="#32CD32" />
                    <Text style={styles.cardText}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Reports')}>
                    <Icon name="document-text" size={30} color="#FFA500" />
                    <Text style={styles.cardText}>Reports</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        marginHorizontal: 32,
        width: '80%',
        height: 60,
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // for android
    },
    cardText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
