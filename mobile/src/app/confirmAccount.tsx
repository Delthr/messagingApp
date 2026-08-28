import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import api from '../utils/axioss';
import stylesBackground from './styles/baseStyle';
import styles from './styles/confirmAccountStyle';

export default function Index() {
    const { username: username, } = useLocalSearchParams<{ username: string }>();

    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    const [activationCode, setActivationCode] = useState('');
    const [activityIndicator, setActivityIndicatorVisibility] = useState(false);
    const [activateButton, setActivateButton] = useState("Activate");
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function handleActivation() {
        setActivityIndicatorVisibility(true);
        try {
            console.log("there we are: ", username, activationCode);
            const response = await api.post('/verify', { username: username, code: activationCode });
            if (response.data = 'Verification ended successfully!') {
                setActivateButton("Activated!");
                await sleep(3000);
                router.push('/');
                setActivityIndicatorVisibility(false);
            } else {
                setActivateButton(response.data)
            }
        } catch (error) {
            setActivateButton("Error!");
            console.error("Error during activation: ", error);
            setActivityIndicatorVisibility(false);
        }
    }
    async function sendNewCode() {
        setActivityIndicatorVisibility(true);
        setActivationCode("");
        try {
            setActivateButton("Sending");
            const response = await api.post('/verify/resend', { username: username });

            if (response) {
                setActivityIndicatorVisibility(false);
            }
            setActivateButton("Sent!");
            await sleep(2000);
            setActivateButton("Activate");
        } catch (error) {
            console.error("Error during resending: ", error);
            setActivityIndicatorVisibility(false);
            setActivateButton("Error");
            await sleep(2000);
            setActivateButton("Activate");
        }
    }

    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={stylesBackground.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.side}>
                    {activityIndicator &&
                        <ActivityIndicator
                            size={'large'}
                            color={'#0804fa'}
                            style={styles.activityIndicator

                            } />}
                    <Text style={styles.title}>Account activation</Text>

                    <TextInput style={styles.codeInput}
                        placeholder='Enter code here...'
                        placeholderTextColor={'#fff'}
                        value={activationCode}
                        onChangeText={setActivationCode}
                    />
                    <TouchableOpacity style={styles.activateButton} onPress={handleActivation}>
                        <Text style={styles.activateButtonText}>
                            {activateButton}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.infoText}>{"You will shortly receive an email \n with a code to activate your account."}</Text>
                    <Text style={styles.infoText}>I didn't receive the code?
                        <Text style={styles.sendCodeText} onPress={sendNewCode}> Send another code.</Text></Text>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}