import { Text, View, Image } from "react-native";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { images } from '../constants';
import CustomButton from "../components/CustomButton";

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),  // Exact match for fontFamily
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  // Wait for fonts to load
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView
      className="bg-slate-900 h-full"
      style={{ backgroundColor: '#121212' }}
    >
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.uniwell}
            className="W-[260px] h-[260px] mb-20"
            resizeMode="contain"
          />

          {/* Combine NativeWind className and inline font style */}

          <CustomButton
            title={'Get Started'}
            containerStyles="w-full mt-7"
            handlePress={() => router.push('/Login')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
