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

const img1 = require("../assets/images/st1.png");
const img2 = require("../assets/images/st2.png");
const img3 = require("../assets/images/st3.png");
const img4 = require("../assets/images/st4.png");
const img5 = require("../assets/images/st5.png");

const pagesData = [
    {
        key: '1',
        title: 'Track Sleep Stages',
        description: 'Let’s create a sleep- friendly environment, establishing a relaxing bedtime routine, and making smart lifestyle choices that promote healthy sleep patterns.',
        image: img1,
    },
    {
        key: '2',
        title: 'Create a dreamy sleep sanctuary',
        description: 'Craft a peaceful bedroom haven keep it cool, dark, and quiet with blackout curtains and earplugs for a truly relaxing sleep experience.',
        image: img2,
    },
    {
        key: '3',
        title: 'Power Down for sleep',
        description: 'Avoid screens for at least an hour before bed.Blue light disrupts melatonin production. Melatonin, a brain- produced hormone, regulates sleep cycles, inducing sleep in darkness and wakefulness in light.',
        image: img3,
    },
    {
        key: '4',
        title: 'Daily relaxing routine',
        description: 'Create a calming nighttime routine by taking a soothing bath, indulging in a good book, or practicing medication for relaxation before bedtime.',
        image: img4,
    },
    {
        key: '5',
        title: 'Listen to your body',
        description: 'Exercise regularly, but avoid vigorous activity close to bedtime. Establish a consistent sleep schedule.',
        image: img5,
    },
];

export default function SleepPatternsScreen({ onClose }) {
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
