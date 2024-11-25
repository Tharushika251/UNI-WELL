import { Ionicons } from '@expo/vector-icons';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    Dimensions,
} from 'react-native';
import React, { useState, useRef } from 'react';

const img1 = require("../assets/images/sp1.png");
const img2 = require("../assets/images/sp2.png"); 
const img3 = require("../assets/images/sp3.png"); 
const img4 = require("../assets/images/sp4.png"); 

const pagesData = [
    {
        key: '1',
        title: 'Track Sleep Stages',
        description: 'See how much time you spend in light, deep, and rapid-eye-movement (REM) sleep. Each plays a vital role in feeling rested.',
        image: img1,
    },
    {
        key: '2',
        title: 'Understand Sleep Efficiency',
        description: 'See how much time you actually spend sleeping compared to time spent in bed.',
        image: img2,
    },
    {
        key: '3',
        title: 'Set Personalized Goals',
        description: 'Use your sleep data to set personalized goals for sleep improvement. Focus on areas like sleep duration, consistency, or bedtime routine adjustments.',
        image: img3,
    },
    {
        key: '4',
        title: 'Identify Sleep Influencers',
        description: 'See how factors like caffeine intake, exercise, or screen time before bed impact your sleep patterns.',
        image: img4,
    },
];

export default function SleepPatternsScreen({onClose}) {
    const [currentPage, setCurrentPage] = useState(0);
    const flatListRef = useRef(null);
    const windowWidth = Dimensions.get('window').width;

    const renderItem = ({ item }) => (
        <ImageBackground source={item.image} style={styles.background}>
            <Ionicons name="chevron-back" size={24} color="white" style={styles.icon} onPress={onClose} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.txt}>{item.description}</Text>
        </ImageBackground>
    );

    const handlePageChange = (index) => {
        setCurrentPage(index);
        flatListRef.current.scrollToIndex({ animated: true, index: index });
    };

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.floor(contentOffsetX / windowWidth);
        setCurrentPage(index);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Better Sleep</Text>
            <View><Ionicons name="chevron-back" size={24} color="white" style={styles.icon} /></View>
            <FlatList
                ref={flatListRef}
                data={pagesData}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.flatList}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />

            <View style={styles.paginationContainer}>
                {pagesData.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.paginationButton,
                            currentPage === index && styles.selectedPaginationButton
                        ]}
                        onPress={() => handlePageChange(index)}
                    >
                        <Text style={styles.paginationText}>{index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    headerText: {
        fontSize: 24,
        textAlign: 'center',
        color: "#C9B926",
        margin: 32,
        marginBottom: 12,
    },
    icon: {
        position: 'absolute',
        top: 32,
        left: 16,
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginTop: 84,
        marginBottom: 48,
    },
    txt: {
        marginTop: 10,
        marginHorizontal: 32,
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 52,
    },
    background: {
        flex: 1,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    paginationButton: {
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: '#F06543',
        borderRadius: 5,
    },
    selectedPaginationButton: {
        backgroundColor: '#FFFFFF',
    },
    paginationText: {
        color: '#121212',
        fontWeight: 'bold',
    },
});
