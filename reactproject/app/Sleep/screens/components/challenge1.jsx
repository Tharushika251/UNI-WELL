import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState} from 'react';

import Challenge1_1Screen from './challenge1_1';
const challenge1Img = require("../assets/images/challenge1Img.jpeg");

const Challenge1Screen = ({ onClose }) => {

    const [isModal1Visible, setModal1Visible] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: "#121212" }}>
            <Text style={{ fontSize: 24, textAlign: 'center', color: "#C9B926", margin: 32 }}>
                Better Sleep
            </Text>
            <View
                style={{
                    width: '100%',
                    height: 50,
                    marginBottom: 18,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: "#696969"
                }}
            >
                <Ionicons
                    name="chevron-back"
                    size={24}
                    style={{ marginLeft: 16 }}
                    onPress={onClose}
                />
                <Text style={{ fontSize: 22, color: 'white', marginLeft: 32 }}>
                    Sleep Insights
                </Text>
            </View>
            <Text style={{ color: 'white', marginLeft: 30, fontSize: 20 }}>Challenge 1</Text>
            <Text
                style={{
                    color: 'white',
                    marginLeft: 30,
                    marginRight: 20,
                    marginTop: 12,
                    fontSize: 16
                }}
            >
                Understanding Insomnia and Finding Relief
            </Text>
            <Image
                source={challenge1Img}
                style={{
                    width: "80%",
                    height: 150,
                    marginTop: 20,
                    marginLeft: 30,
                    marginRight: 30,
                    alignContent: 'center'
                }}
            />
            <View>
                <TouchableOpacity onPress={() => setModal1Visible(true)}>
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 20, fontSize: 16 }}>
                        1. What is insomnia?
                    </Text>
                </TouchableOpacity>
                <Modal
                    visible={isModal1Visible}
                    onRequestClose={() => setModal1Visible(false)}
                    animationType="slide"
                >
                    <Challenge1_1Screen onClose={() => setModal1Visible(false)} />
                </Modal>
            </View>            
            <View>
                <TouchableOpacity>
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>
                        2. Symptoms and Causes
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity>
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>
                        3. What causes the condition?
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity>
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>
                        4. What are the complications of {"\n"}     this condition?
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity>
                    <Text style={{ color: 'white', marginLeft: 30, marginRight: 20, marginTop: 12, fontSize: 16 }}>
                        5. Diagnosis and Tests
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Challenge1Screen;
