import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const reportsImg = require("../assets/images/reportsImg.jpeg")
import { useState } from 'react';

export default function ReportsScreen({onClose}) {

    const [isWeeklyModalVisible, setWeeklyModalVisible] = useState(false);
    const [isMonthlyModalVisible, setMonthlyModalVisible] = useState(false);

    return (
        <View style={styles.container1}>
        
            <Image source={reportsImg} style={{ width: "100%", height: 250 , marginTop: 64}} />
            <View style={styles.card}>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => setWeeklyModalVisible(true)}>
                        <Text style={styles.buttonText}>Weekly Reports</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={isWeeklyModalVisible}
                        onRequestClose={() => setWeeklyModalVisible(false)}
                        animationType='slide'
                    >
                        <View style={styles.container1}>
                            <Text style={styles.hText}>Better Sleep</Text>
                            <View style={styles.container2}>
                                <Ionicons name="chevron-back" size={24} style={{ marginLeft: 16 }} onPress={() => setWeeklyModalVisible(false)} />
                                <Text style={styles.title}>Weekly Reports</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => setMonthlyModalVisible(true)}>
                        <Text style={styles.buttonText}>Monthly Reports</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={isMonthlyModalVisible}
                        onRequestClose={() => setMonthlyModalVisible(false)}
                        animationType='slide'
                    >
                        <View style={styles.container1}>
                            <Text style={styles.hText}>Better Sleep</Text>
                            <View style={styles.container2}>
                                <Ionicons name="chevron-back" size={24} style={{ marginLeft: 16 }} onPress={() => setMonthlyModalVisible(false)} />
                                <Text style={styles.title}>Monthly Reports</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container2: { 
        width: '100%', 
        height: 50, 
        marginBottom: 32, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: "#696969" 
    },
    container1: { 
        flex: 1, 
        backgroundColor: "#121212" 
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    card: {
        marginTop: 64,
        margin: 32,
        alignContent: 'center',
        width: '80%',
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5  //for android
    },
    button: {
        borderRadius: 20,
        backgroundColor: "#F06543",
        padding: 12,
        alignItems: 'center',
        marginBottom: 24
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    },
    hText: { 
        fontSize: 24, 
        textAlign: 'center', 
        color: "#C9B926", 
        margin: 32, 
        marginBottom: 12 
    },
    title: { 
        fontSize: 20, 
        color: 'white', 
        marginLeft: 32 
    },

});


