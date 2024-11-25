import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const solution1Img = require("../assets/images/solution1Img.jpeg");

export default function Solution1_1Screen({ onClose }) {
    return (
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
            <Text style={{ fontSize: 24, textAlign: 'center', color: "#C9B926", margin: 32, marginBottom: 12 }}>Better Sleep</Text>
            <View style={{ width: '100%', height: 50, marginBottom: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: "#696969" }}>
                <Ionicons name="chevron-back" size={24} style={{ marginLeft: 16 }} onPress={onClose} />
                <Text style={{ fontSize: 22, color: 'white', marginLeft: 32 }}>Sleep Insights</Text>
            </View>
            <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, fontSize: 20 }}>Improving Insomnia and Sleeplessness</Text>
            <Image source={solution1Img} style={{ width: "80%", height: 150, marginTop: 10, marginLeft: 30, marginRight: 30, alignContent: 'center' }} />
            <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 18 }}>Management and Treatment</Text>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.card}>
                    <Text style={styles.justifiedHeaderText}>How is insomnia treated, and is there a cure?</Text>
                    <Text style={styles.justifiedText}>
                        There are many ways to treat insomnia, ranging from simple changes in your lifestyle and habits to various medications. The main approaches to treating insomnia are:
                    </Text>
                    <Text style={styles.justifiedText}>
                        1. Developing and practicing good sleep habits (also known as sleep hygiene).
                    </Text>
                    <Text style={styles.justifiedText}>
                        2. Medications that help you fall or stay asleep (especially ones that aren’t habit-forming or that might otherwise affect your sleep).
                    </Text>
                    <Text style={styles.justifiedText}>
                        3. Mental healthcare.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.justifiedHeaderText}>Mental healthcare</Text>
                    <Text style={styles.justifiedText}>
                        Because your mental health can greatly affect your ability to sleep, mental healthcare is one of the most effective ways to improve your sleep, either directly or indirectly. A healthcare provider is the best person to tell you more about the possible mental health options and provide you with resources on how to get this kind of care.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    justifiedText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'justify',
        marginTop: 8,
    },
    justifiedHeaderText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'justify',
        marginTop: 8,
        fontWeight: 'bold'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainer: {
        width: '80%',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 12,
    },
    card: {
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
        elevation: 5,
    },
});
