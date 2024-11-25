/*import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
    const navigation = useNavigation();
    const [collapsed, setCollapsed] = useState(true);

    const toggleExpanded = () => {
        setCollapsed(!collapsed); // Toggle menu collapse
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuContainer}>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Icon name="bars" size={30} color="#fff" />
                </TouchableOpacity>

                <Collapsible collapsed={collapsed} align="center">
                    <View style={styles.menuContent}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Sleep')}>
                            <Text style={styles.menuText}>Sleep</Text>
                        </TouchableOpacity>
                        <View style={styles.border} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Goals')}>
                            <Text style={styles.menuText}>Goals</Text>
                        </TouchableOpacity>
                        <View style={styles.border} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Sounds')}>
                            <Text style={styles.menuText}>Sounds</Text>
                        </TouchableOpacity>
                        <View style={styles.border} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Insights')}>
                            <Text style={styles.menuText}>Insights</Text>
                        </TouchableOpacity>
                        <View style={styles.border} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Reports')}>
                            <Text style={styles.menuText}>Reports</Text>
                        </TouchableOpacity>
                    </View>
                </Collapsible>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212"
    },
    menuContainer: {
        position: 'absolute', // Keeps it fixed on the screen
        bottom: 0,
        left: 0,
        right: 200,
        backgroundColor: 'transparent', // Make background transparent
        padding: 0, // Remove padding
    },
    menuContent: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff', // Background for the collapsible menu
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        lineHeight: 20,
        marginBottom: 16
    },
    menuItem: {
        paddingVertical: 10,
    },
    menuText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#121212',
        marginLeft: 16
    },
    border: {
        height: 1,
        backgroundColor: '#ddd', // Border color
    }
});

export default MenuScreen;
*/