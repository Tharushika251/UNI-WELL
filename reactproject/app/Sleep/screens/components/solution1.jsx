import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import Solution1_1Screen from './solution1_1';
const challenge1Img = require("../assets/images/challenge1Img.jpeg");

export default function Solution1Screen({ onClose }) {

    const [isModal1Visible, setModal1Visible] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
            <Text style={{ fontSize: 24, textAlign: 'center', color: "#C9B926", margin: 32 }}>Better Sleep</Text>
            <View style={{ width: '100%', height: 50, marginBottom: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: "#696969" }}>
                <Ionicons name="chevron-back" size={24} style={{ marginLeft: 16 }} onPress={onClose} />
                <Text style={{ fontSize: 22, color: 'white', marginLeft: 32 }}>Sleep Insights</Text>
            </View>
            <Text style={{ color: 'white', marginLeft: 30, fontSize: 20 }}>Solution 1</Text>
            <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>Improving Insomnia and Sleeplessness </Text>
            <Image source={challenge1Img} style={{ width: "80%", height: 150, marginTop: 20, marginLeft: 30, marginRight: 30, alignContent: 'center' }} />
            <View>
                <TouchableOpacity onPress={() => setModal1Visible(true)}>
                    <Text style={styles.txt}>1. Management and Treatment</Text>
                </TouchableOpacity>
                <Modal
                    visible={isModal1Visible}
                    onRequestClose={() => setModal1Visible(false)}
                    animationType="slide"
                >
                    <Solution1_1Screen onClose={() => setModal1Visible(false)} />
                </Modal>
            </View>
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>2. Prevention</Text>
            
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>3. Outlook / Prognosis</Text>
            
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>4. Living With</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txt: { 
        color: 'white', 
        marginLeft: 30, 
        marginRight: 20, 
        marginTop: 20, 
        fontSize: 16 
    },
});
