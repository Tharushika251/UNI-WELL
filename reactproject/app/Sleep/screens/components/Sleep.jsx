import { View, Text, Image, StyleSheet } from 'react-native';
import MenuScreen from './Menu';
import HomeScreen from '../HomeScreen';

const mainImage = require("../assets/images/mainImage.jpeg");

export default function SleepScreen() {
    return (
        <View style={styles.screenContainer}>
            <Image source={mainImage} style={styles.img} />
            <Text style={styles.txtH}>Better Sleep</Text>
            <View style={styles.iconContainer}>
                <Divider1 />
                <Text style={styles.iconText}>😴</Text>
                <Divider1 />
            </View>
            <Text style={styles.txt}>Unlock the power of restful night and wake up ready to shine.</Text>
            <Divider />
            <HomeScreen/>
        </View>
    );
};

// Divider Component
const Divider = () => {
    return (
        <View style={styles.divider} />
    );
};

const Divider1 = () => {
    return (
        <View style={styles.divider1} />
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: "#121212",
        alignItems: 'center', // Center horizontally
    },
    divider: {
        height: 1,
        backgroundColor: '#cccccc',
        marginVertical: 16,
        width: '80%', // Make the divider width match the content
    },
    divider1: {
        width: '45%',
        height: 1,
        backgroundColor: '#cccccc',
        marginVertical: 16,
    },
    iconText: {
        fontSize: 32,
        color: 'white',
        textAlign: 'center', // Align the emoji in the center
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Align horizontally in the center
    },
    img: {
        width: "100%",
        height: 200,
        marginTop: 32
    },
    txtH: {
        fontSize: 24,
        textAlign: 'center',
        color: "#C9B926",
        marginTop: 18
    },
    txt: {
        fontSize: 16,
        textAlign: 'center',
        color: "white",
        marginHorizontal: 18,
    }
});
