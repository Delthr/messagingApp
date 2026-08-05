import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import api from '../utils/axioss';
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

    type Requester = {
        email: string,
        id: string,
        username: string,
        friendshipId: string,
    };

    const [requests, setRequests] = useState<Requester[]>([]);
    const [friendshipId, setFriendshipId] = useState<string | null>(null);


    async function getRequests(): Promise<Requester[] | null> {
        try {
            console.log("Getting Requests list");
            const response = await api.get('/friends/requests');
            console.log(response.data);
            console.log("requests loaded!")
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                alert("To be implemented!");
                return null;
            } else if (error.request) {
                alert("Cannot connect with server.");
                return null;
            } else {
                console.log("Ups... Something went wrong! ", error.message);
                return null;
            }
        }
    };
    useEffect(() => {
        async function fetchRequests() {
            const data = await getRequests();
            if (data) {
                setRequests(data);
            }
        };
        fetchRequests();
    }, []);

    async function acceptFriend(friendshipId: string) {
        try {
            await api.post('/friends/accept', friendshipId, {
                headers: { 'Content-Type': 'text/plain' }
            });
        } catch (error) {
            console.log(error);
        }
    };

    async function rejectFriend(friendshipId: string) {
        try {
            await api.post('/friends/reject', friendshipId, {
                headers: { 'Content-Type': 'text/plain' }
            });
        } catch (error) {
            console.log(error);
        }
    };



    const Record = ({ email, id, username, friendshipId }: Requester) => (
        <View style={styles.requestBox}>

            <View style={styles.userInfo}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.data}>
                    <Text style={styles.usernameText}>{username}</Text>
                    <Text style={styles.emailText}>{email}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => acceptFriend(friendshipId)}>
                <Text style={styles.acceptButton}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => rejectFriend(friendshipId)}>
                <Text style={styles.acceptButton}>Reject</Text>
            </TouchableOpacity>
        </View>
    );

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
                <FlatList data={requests}
                    renderItem={({ item }) => <Record username={item.username} email={item.email} id={item.id} friendshipId={item.friendshipId} />}
                    keyExtractor={item => item.id.toString()}
                />
            </SafeAreaView>
        </LinearGradient>
    );

}