import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './styles/baseStyle';
import styles from './styles/contactStyle';


export default function Index() {


    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;


    const { id, username, email } = useLocalSearchParams<{ id: string; username: string; email: string }>();

    async function getBack() {
        router.push('/mainPanel');
    }

    return (
        <LinearGradient style={styles.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View>
                    <TouchableOpacity style={styles.backButton} onPress={() => getBack()}>
                        <Text style={styles.backButtonText}>
                            Back
                        </Text>
                    </TouchableOpacity>
                    <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                    <Text style={styles.text}>
                        {username}{"\n"}
                        {email}
                    </Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}