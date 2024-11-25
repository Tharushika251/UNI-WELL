import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Modal
} from 'react-native';
import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Challenge1Screen from './challenge1';
import Solution1Screen from './solution1';
import SleepPatternsScreen from './sleepPatterns';
import SleepTipsScreen from './sleepTips';

//------------------------------------------------------------------

const Tab = createMaterialTopTabNavigator();

const challengeData = [
    { id: '1', title: 'Understanding Insomnia and Finding Relief', image: require('../assets/images/challenge1Img.jpeg') },
    { id: '2', title: 'New Challenge 2', image: require('../assets/images/challenge1Img.jpeg') },
    { id: '3', title: 'New Challenge 3', image: require('../assets/images/challenge1Img.jpeg') },
];

const solutionData = [
    { id: '4', title: 'Improving Insomnia and Sleeplessness', image: require('../assets/images/solution1Img.jpeg') },
    { id: '5', title: 'Solution 2', image: require('../assets/images/solution1Img.jpeg') },
    { id: '6', title: 'Solution 3', image: require('../assets/images/solution1Img.jpeg') },
];

// Carousel Component
const Carousel = ({ data }) => {
    const [isModal1Visible, setModal1Visible] = useState(false);
    const [isModal4Visible, setModal4Visible] = useState(false);

    return (
        <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View>
                    {/* Check if the item.id is '1' to open the modal only for Challenge 1 */}
                    <TouchableOpacity onPress={() => {
                        if (item.id === '1') {
                            setModal1Visible(true);
                        }
                        else if (item.id === '4') {
                            setModal4Visible(true);
                        }
                    }}>
                        <View style={styles.card1}>
                            <Image source={item.image} style={styles.cardImage} />
                            <Text style={styles.cardText}>{item.title.toString()}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Modal specifically for the challenge with id: 1 */}
                    {item.id === '1' && (
                        <Modal
                            visible={isModal1Visible}
                            onRequestClose={() => setModal1Visible(false)}
                            animationType="fade"
                        >
                            <Challenge1Screen onClose={() => setModal1Visible(false)} />
                        </Modal>
                    )}
                    {item.id === '4' && (
                        <Modal
                            visible={isModal4Visible}
                            onRequestClose={() => setModal4Visible(false)}
                            animationType="fade"
                        >
                            <Solution1Screen onClose={() => setModal4Visible(false)} />
                        </Modal>
                    )}
                </View>
            )}
        />
    );
};

// Challenges Screen
const ChallengesScreen = () => {
    return (
        <View style={styles.containerC}>
            <Carousel data={challengeData} />
        </View>
    );
};

// Solutions Screen
const SolutionsScreen = () => {
    return (
        <View style={styles.containerC}>
            <Carousel data={solutionData} />
        </View>
    );
};

//------------------------------------------------------------------

const sleepPatterns = require("../assets/images/sleepPatterns.jpeg");
const tipsForSleep = require("../assets/images/tipsForSleep.jpeg");

// Sleep Insights Component
export default function InsightsScreen() {

    const [isSleepPatternsModalVisible, setSleepPatternsModalVisible] = useState(false); // State for Sleep Patterns modal
    const [isSleepTipsModalVisible, setSleepTipsModalVisible] = useState(false); // State for Sleep Patterns modal

    return (
        <View style={styles.container}>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Insights</Text>
            </View>

            <View style={styles.container1}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity style={styles.card} onPress={() => setSleepPatternsModalVisible(true)}>
                        <ImageBackground source={sleepPatterns} style={styles.insightImage} imageStyle={styles.cardBackgroundImage}>
                            <Text style={styles.insightText}>Learn About Your Sleep Patterns</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => setSleepTipsModalVisible(true)}>
                        <ImageBackground source={tipsForSleep} style={styles.insightImage} imageStyle={styles.cardBackgroundImage}>
                            <Text style={styles.insightText}>Helpful Tips for Better Sleep</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.titleContainer, {marginBottom:16}]}>
                <Text style={styles.title}>Articles</Text>
            </View>

            <Tab.Navigator
                swipeEnabled={false}  // Disable swiping between tabs
            >
                <Tab.Screen name="Challenges" component={ChallengesScreen} />
                <Tab.Screen name="Solutions" component={SolutionsScreen} />
            </Tab.Navigator>

            {/* Modal for Learning About Sleep Patterns */}
            <Modal
                visible={isSleepPatternsModalVisible}
                onRequestClose={() => setSleepPatternsModalVisible(false)}
                animationType="fade"
            >
                <SleepPatternsScreen onClose={() => setSleepPatternsModalVisible(false)} />
            </Modal>

            {/* Modal for Tips */}
            <Modal
                visible={isSleepTipsModalVisible}
                onRequestClose={() => setSleepTipsModalVisible(false)}
                animationType="fade"
            >
                <SleepTipsScreen onClose={() => setSleepTipsModalVisible(false)} />
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    container1: {
        marginBottom: 150
    },
    containerC: {
        flex: 1,
        margin: 16
    },
    headerText: {
        fontSize: 24,
        textAlign: 'center',
        color: "#C9B926",
        margin: 32,
        marginBottom: 12
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        borderWidth: 1,
        width: "40%",
        height: 110,
        overflow: 'hidden',
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    insightImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBackgroundImage: {
        borderRadius: 8,
    },
    insightText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 5,
    },
    titleContainer: {
        width: '100%',
        height: 50,
        marginBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#696969"
    },
    title: {
        fontSize: 20,
        color: 'white',
        marginLeft: 32
    },
    cardImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    cardText: {
        marginTop: 10,
        marginBottom:10,
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    descriptionText: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    card1: {
        marginRight: 16,
        backgroundColor: '#282828',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#C9B926',
        width: 180,
        height: 230,
        overflow: 'hidden',
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        color: '#C9B926',
        marginBottom: 10,
    },
    modalText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#F06543',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

