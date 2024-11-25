import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const challenge1Img = require("../assets/images/challenge1Img.jpeg")

export default function Challenge1_1Screen({ onClose }) {
    return (
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
            <Text style={{ fontSize: 24, textAlign: 'center', color: "#C9B926", margin: 32, marginBottom: 12 }}>Better Sleep</Text>
            <View style={{ width: '100%', height: 50, marginBottom: 18, flexDirection: 'row', alignItems: 'center', backgroundColor: "#696969" }}>
                <Ionicons name="chevron-back" size={24} style={{ marginLeft: 16 }} onPress={onClose} />
                <Text style={{ fontSize: 22, color: 'white', marginLeft: 32 }}>Sleep Insights</Text>
            </View>
            <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, fontSize: 20 }}>Understanding Insomnia and Finding Relief  </Text>
            <Image source={challenge1Img} style={{ width: "80%", height: 150, marginTop: 10, marginLeft: 30, marginRight: 30, alignContent: 'center' }} />
            <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 18 }}>What is insomnia?</Text>
            <ScrollView style={{ width: '80%', marginLeft: 30, marginRight: 30, marginTop: 12 }}>
                <View style={styles.card}>
                    {/* First paragraph */}
                    <Text style={styles.justifiedText}>
                        Insomnia is when you aren’t sleeping as you should. That can mean you aren’t sleeping enough, you aren’t sleeping well or you’re having trouble falling or staying asleep. For some people, insomnia is a minor inconvenience. For others, insomnia can be a major disruption. The reasons why insomnia happens can vary just as widely.
                    </Text>
                    {/* Second paragraph */}
                    <Text style={styles.justifiedText}>
                        Your body needs sleep for many reasons (and science is still unlocking an understanding of why sleep is so important to your body). Experts do know that when you don’t sleep enough, it can cause sleep deprivation, which is usually unpleasant (at the very least) and keeps you from functioning at your best.
                    </Text>
                </View>

                <View style={styles.card}>
                    {/* Third paragraph */}
                    <Text style={styles.justifiedHeaderText}>
                        How sleep needs and habits vary and what that means for you.
                    </Text>
                    {/* Fourth paragraph */}
                    <Text style={styles.justifiedText}>
                        Sleep habits and needs can be very different from person to person. Because of these variations, experts consider a wide range of sleep characteristics “normal.” Some examples of this include:
                    </Text>
                    {/* List items */}
                    <Text style={styles.justifiedText}>
                        Early birds/early risers: {"\n"}Some people naturally prefer to go to bed and wake up early.
                    </Text>
                    <Text style={styles.justifiedText}>
                        Night owls/late risers:  {"\n"}Some people prefer to go to bed and wake up late.
                    </Text>
                    <Text style={styles.justifiedText}>
                        Short-sleepers:  {"\n"}Some people naturally need less sleep than others. Research indicates that there may even be a genetic reason for that.
                    </Text>
                    <Text style={styles.justifiedText}>
                        Learned sleep differences:  {"\n"}Some people develop sleep habits for specific reasons, such as their profession. Military personnel with combat experience often learn to be light sleepers because of the demands and dangers of their profession. On the opposite end of that spectrum, some people learn to be very heavy sleepers so they can still sleep despite surrounding noises.
                    </Text>
                    <Text style={styles.justifiedText}>
                        Natural changes in sleep needs:  {"\n"}Your need for sleep changes throughout your life. Infants need significantly more sleep, between 14 and 17 hours per day, while adults (ages 18 and up) need about seven to nine hours per day.
                    </Text>
                </View>

                <View style={styles.card}>
                    {/* Types of insomnia */}
                    <Text style={styles.justifiedHeaderText}>
                        Types of insomnia
                    </Text>
                    <Text style={styles.justifiedText}>
                        There are two main ways that experts use to put insomnia into categories: Time: Experts classify insomnia as acute (short-term) or chronic (long-term). The chronic form is known as insomnia disorder. Cause: Primary insomnia means it happens on its own. Secondary insomnia means it’s a symptom of another condition or circumstance.
                    </Text>
                </View>

                <View style={styles.card}>
                    {/* How common is insomnia? */}
                    <Text style={styles.justifiedHeaderText}>
                        How common is insomnia?
                    </Text>
                    <Text style={styles.justifiedText}>
                        Both the acute and chronic forms of insomnia are very common. Roughly, 1 in 3 adults worldwide have insomnia symptoms, and about 10% of adults meet the criteria for insomnia disorder.
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
