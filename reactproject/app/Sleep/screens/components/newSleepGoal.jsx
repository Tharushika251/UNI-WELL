import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Switch,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import axios from 'axios';

const sleepIcons = [
    { id: '1', name: 'bed1', label: 'Bed1', icon: <Ionicons name="bed-sharp" size={48} color="white" /> },
    { id: '2', name: 'bed2', label: 'Bed2', icon: <FontAwesome name="bed" size={48} color="white" /> },
    { id: '3', name: 'moon', label: 'Moon', icon: <Ionicons name="moon" size={48} color="white" /> },
    { id: '4', name: 'star', label: 'Stars', icon: <Ionicons name="star" size={48} color="white" /> },
    { id: '5', name: 'star-and-crescent', label: 'Star&Moon', icon: <FontAwesome5 name="star-and-crescent" size={48} color="white" /> },
    { id: '6', name: 'cloud-moon', label: 'Cloud Moon', icon: <FontAwesome5 name="cloud-moon" size={48} color="white" /> },
    { id: '7', name: 'star-face', label: 'Stars', icon: <MaterialCommunityIcons name="star-face" size={48} color="white" /> },
    { id: '8', name: 'sleep', label: 'Sleep', icon: <MaterialCommunityIcons name="sleep" size={48} color="white" /> },
    { id: '9', name: 'icon1', label: 'Sleepy', icon: <Text style={{ fontSize: 48 }}>😴</Text> },
    { id: '10', name: 'icon2', label: 'Moon', icon: <Text style={{ fontSize: 48 }}>🌙</Text> },
    { id: '11', name: 'icon3', label: 'Bed', icon: <Text style={{ fontSize: 48 }}>🛌</Text> },
    { id: '12', name: 'icon4', label: 'Zzz', icon: <Text style={{ fontSize: 48 }}>💤</Text> },
    { id: '13', name: 'icon5', label: 'Alarm', icon: <Text style={{ fontSize: 48 }}>⏰</Text> },
    { id: '14', name: 'icon6', label: 'Headphones', icon: <Text style={{ fontSize: 48 }}>🎧</Text> },
    { id: '15', name: 'icon7', label: 'Yoga', icon: <Text style={{ fontSize: 48 }}>🧘‍♂️</Text> },
];

const frequencyOptions = [
    { id: '1', label: '1 day per week' },
    { id: '2', label: '2 days per week' },
    { id: '3', label: '3 days per week' },
    { id: '4', label: '4 days per week' },
    { id: '5', label: '5 days per week' },
    { id: '6', label: '6 days per week' },
    { id: '7', label: 'Every day' },
];

export default function NewSleepGoalScreen({ onSubmitGoal }) {
    const [goalName, setGoalName] = useState("");
    const [isEnabled, setIsEnabled] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [errors, setErrors] = useState({});
    const [showIconPicker, setShowIconPicker] = useState(false); // Manage collapsible icon picker
    const [selectedIcon, setSelectedIcon] = useState(null); // Manage selected icon
    const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState("Select Frequency");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [isPeriodCollapsed, setIsPeriodCollapsed] = useState(true); // State for collapsible section
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        let errors = {};

        if (!goalName) errors.goalName = "Goal name is required";
        if (!selectedIcon) errors.icon = "An icon must be selected";
        if (selectedFrequency === "Select Frequency") errors.frequency = "Frequency must be selected";
        if (!selectedPeriod) errors.period = "Period must be selected";
        if (isEnabled && !selectedTime) errors.reminder = "Reminder time must be set";

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const toggleSwitch = () => {
        setIsEnabled(prev => !prev);
        setShowTimePicker(!isEnabled); // Toggle time picker visibility
    };

    const onTimeChange = (event, selectedDate) => {
        if (event.type === 'set') { // Only update if user selects a time
            const currentTime = selectedDate || selectedTime;
            setSelectedTime(currentTime);
        }
        setShowTimePicker(false);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);
            try {
                const newGoal = {
                    goalName,
                    selectedPeriod,
                    selectedIcon,
                    selectedTime,
                    selectedFrequency,
                };

                const response = await axios.post('http://localhost:5000/api/sleep-goal', newGoal);

                // Reset form and close modal
                addNewGoal(newGoal);
                setGoalName("");
                setSelectedPeriod("");
                setSelectedIcon(null);
                setSelectedTime(new Date());
                setSelectedFrequency("Select Frequency");
                setErrors({});
                setModalVisible(false);

                // Show confetti and congratulations message
                setShowConfetti(true);
                Alert.alert("Congratulations!", "Your sleep goal has been submitted successfully!");
            } catch (error) {
                console.error('Error submitting sleep goal:', error);
                Alert.alert('Error', 'Could not submit your sleep goal. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleIconPicker = () => {
        setShowIconPicker(prev => !prev); // Toggle icon picker visibility
    };

    const handleIconSelect = (icon) => {
        setSelectedIcon(icon); // Set selected icon
        setShowIconPicker(false); // Hide icon picker after selection
    };

    const handlePeriodSelect = (period) => {
        setSelectedPeriod(period);
        setIsPeriodCollapsed(true); // Collapse after selection
    };

    const togglePeriodCollapse = () => {
        setIsPeriodCollapsed(!isPeriodCollapsed); // Toggle visibility
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Better Sleep</Text>
            <View style={styles.titleContainer}>
                <Ionicons name="chevron-back" size={24} color="white" style={{ marginLeft: 16 }}/>
                <Text style={styles.title}>New Sleep Goal</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.cardLarge}>
                        <View style={styles.card}>
                            <Text style={styles.goalNameLabel}>Goal Name</Text>
                            <TextInput
                                style={styles.input}
                                value={goalName}
                                onChangeText={setGoalName}
                                placeholder="Enter your sleep goal name"
                                placeholderTextColor="#999"
                                autoCapitalize='words'
                            />
                            {
                                errors.goalName ? <Text style={styles.errorText}>{errors.goalName}</Text> : null
                            }
                        </View>

                        {/* Select Icon Section */}
                        <View style={styles.card}>
                            <TouchableOpacity onPress={toggleIconPicker} style={styles.iconSelect}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.goalNameLabel}>Select Icon:    </Text>
                                    {selectedIcon && (
                                        <View style={styles.selectedIconWrapper}>
                                            {selectedIcon.icon}
                                        </View>
                                    )}
                                </View>
                                <Ionicons name="chevron-down" size={24} color="white" />
                            </TouchableOpacity>

                            {/* Collapsible FlatList for Icons */}
                            {showIconPicker && (
                                <FlatList
                                    data={sleepIcons}
                                    keyExtractor={(item) => item.id}
                                    numColumns={3}
                                    initialNumToRender={5} // Limits initial rendering
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.iconItem} onPress={() => handleIconSelect(item)}>
                                            <View style={styles.iconTextContainer}>
                                                {item.icon}
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={styles.iconGrid}
                                />
                            )}

                            {errors.icon ? <Text style={styles.errorText}>{errors.icon}</Text> : null}
                        </View>

                        {/* Frequency Selection */}
                        <View style={styles.card}>
                            <TouchableOpacity onPress={() => setShowFrequencyPicker(prev => !prev)} style={styles.iconSelect}>
                                <Text style={styles.goalNameLabel}>Select Frequency</Text>
                                <Ionicons name="chevron-down" size={24} color="white" />
                            </TouchableOpacity>

                            {showFrequencyPicker && (
                                <FlatList
                                    data={frequencyOptions}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.iconItem}
                                            onPress={() => {
                                                setSelectedFrequency(item.label);
                                                setShowFrequencyPicker(false);
                                            }}
                                        >
                                            <Text style={styles.iconText}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={styles.iconGrid}
                                />
                            )}

                            {errors.frequency ? <Text style={styles.errorText}>{errors.frequency}</Text> : null}

                            {/* Render the selected frequency below the dropdown */}
                            {selectedFrequency !== "Select Frequency" && (
                                <View style={styles.selectedFrequencyContainer}>
                                    <Text style={[styles.selectedTimeText, { color: 'white', marginLeft: 10 }]}>{selectedFrequency}</Text>
                                </View>
                            )}
                        </View>

                        {/* Period Selection */}
                        <View style={styles.card}>
                            <TouchableOpacity onPress={togglePeriodCollapse} style={styles.collapsibleHeader}>
                                <View style={styles.period}>
                                    <Text style={styles.goalNameLabel}>Period</Text>
                                    <Ionicons
                                        name={isPeriodCollapsed ? "chevron-down" : "chevron-up"}
                                        size={20}
                                        color="white"
                                    />
                                </View>
                                <Text style={styles.periodDescription}>Build a strong habit and level up over time!</Text>
                            </TouchableOpacity>

                            {/* Collapsible Content */}
                            {!isPeriodCollapsed && (
                                <>
                                    <TouchableOpacity onPress={() => handlePeriodSelect('One Week')} style={styles.periodButton}>
                                        <Text style={styles.periodText}>One Week</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handlePeriodSelect('Two Weeks')} style={styles.periodButton}>
                                        <Text style={styles.periodText}>Two Weeks</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handlePeriodSelect('Three Weeks')} style={styles.periodButton}>
                                        <Text style={styles.periodText}>Three Weeks</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handlePeriodSelect('Not Sure')} style={styles.periodButton}>
                                        <Text style={styles.periodText}>Not Sure</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            {errors.period ? <Text style={styles.errorText}>{errors.period}</Text> : null}
                        </View>

                        {/* Reminders Section */}
                        <View style={[styles.card, styles.switchContainer]}>
                            <Text style={styles.goalNameLabel}>Reminders</Text>
                            <Switch
                                value={isEnabled}
                                onValueChange={toggleSwitch}
                                trackColor={{ false: "#767577", true: "lightblue" }}
                                thumbColor={"#f4f3f4"}
                            />
                        </View>

                        {isEnabled && (
                            <View style={styles.card}>
                                <Text style={[styles.goalNameLabel, styles.reminderText]}>Set Reminder Time</Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={styles.buttonText}>Pick a time</Text>
                                </TouchableOpacity>
                                <Text style={[styles.selectedTimeText, { color: 'white', textAlign: 'center' }]}>
                                    {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                                {showTimePicker && (
                                    Platform.OS === 'ios' ? (
                                        <DateTimePicker
                                            value={selectedTime}
                                            mode="time"
                                            display="default"
                                            onChange={onTimeChange}
                                        />
                                    ) : (
                                        <DateTimePicker
                                            value={selectedTime}
                                            mode="time"
                                            display="clock" // Use clock for Android
                                            onChange={onTimeChange}
                                        />
                                    )
                                )}
                                {errors.reminder ? <Text style={styles.errorText}>{errors.reminder}</Text> : null}
                            </View>
                        )}

                    </View>
                </ScrollView>
                <TouchableOpacity
                    style={styles.button1}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Create Goal'}</Text>

                    {showConfetti && (
                        <ConfettiCannon
                            count={200}      // Number of confetti particles
                            origin={{ x: -10, y: 0 }}  // Starting point of confetti
                            fadeOut={true}   
                            onAnimationEnd={() => setShowConfetti(false)}  
                        />
                    )}

                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        justifyContent: 'center'
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    headerText: {
        fontSize: 24,
        textAlign: 'center',
        color: "#C9B926",
        margin: 32,
        marginBottom: 12
    },
    card: {
        alignSelf: 'center',
        marginHorizontal: 32,
        marginBottom: 16,
        backgroundColor: '#1E1E1E',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        width: "80%"
    },
    cardLarge: {
        alignSelf: 'center',
        marginHorizontal: 32,
        backgroundColor: '#1E1E1E',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        width: "90%",
    },
    button: {
        borderRadius: 20,
        backgroundColor: "#F06543",
        padding: 12,
        alignItems: 'center',
        width: "80%",
        margin: 16,
        alignSelf: 'center'
    },
    button1: {
        borderRadius: 20,
        backgroundColor: "#C9B926",
        padding: 12,
        alignItems: 'center',
        width: "80%",
        margin: 16,
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold"
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        color: "white",
        marginLeft: 16,
        fontWeight: 'bold'
    },
    goalNameLabel: {
        fontSize: 18,
        color: "white",
        marginBottom: 8
    },
    reminderText: {
        fontSize: 16,
        marginVertical: 8
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
    iconSelect: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: "#444",
    },
    iconSelectText: {
        fontSize: 16,
        color: "#C9B926"
    },
    iconList: {
        maxHeight: 150,
        marginTop: 8,
    },
    iconItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: "#444",
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    iconText: {
        fontSize: 16,
        color: "#C9B926",
        marginLeft: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconSelectIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        padding: 8,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    period: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 10 
    },
    periodButton: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
    },
    periodText: {
        fontSize: 15,
        color: "white",
    },
    periodDescription: {
        fontSize: 14,
        color: "#999",
        marginBottom: 8,
        textAlign: 'center'
    },
    input:{
        color:'white'
    }

});

