import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './styles/baseStyle';
import styles from './styles/requestsStyle';


export default function Index() {

    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    type Requested = { username: string; email: string };
    const Record = ({ username, email }: Requested) => (
        <View style={styles.requestBox}>

            <View style={styles.userInfo}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.data}>
                    <Text style={styles.usernameText}>{username}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => console.log('Accepted', username)}>
                <Text style={styles.acceptButton}>Accept</Text>
            </TouchableOpacity>
        </View>
    );
    const Requests = [
        {
            id: '1',
            username: 'Jola',
            email: 'j@gmail.com',
        },
        {
            id: '2',
            username: 'Jake',
            email: 'ja@gmail.com',
        },
        {
            id: '3',
            username: 'John',
            email: 'john@gmail.com',
        },
        {
            id: '4',
            username: 'Alice',
            email: 'whoIsAlice@gmail.com',
        },
        {
            id: '5',
            username: 'Diana',
            email: 'd@gmail.com',
        },
        {
            id: '6',
            username: 'Arnold',
            email: 'a@gmail.com',
        }
    ]

    async function getBack() {
        router.push('/mainPanel');

    }

    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={stylesBackground.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <TouchableOpacity style={styles.backButton} onPress={() => getBack()}>
                    <Text style={styles.backButtonText}>
                        Back
                    </Text>
                </TouchableOpacity>
                <FlatList data={Requests}
                    renderItem={({ item }) => <Record username={item.username} email={item.email} />}
                    keyExtractor={item => item.id.toString()}
                />
            </SafeAreaView>
        </LinearGradient>
    );

}