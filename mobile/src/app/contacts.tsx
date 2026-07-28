import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import api from './axioss';
import stylesBackground from './baseStyle';
import styles from './contactsStyles';

export default function Index() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    const contactTheme = isDarkMode ? styles.darkContactBox : styles.lightContactBox;
    const contactTextTheme = isDarkMode ? styles.darkContactText : styles.lightContactText;
    const sendedByTextTheme = isDarkMode ? styles.darkSendedByText : styles.lightSendedByText;
    const friendsButtonTheme = isDarkMode ? styles.darkFriendsButton : styles.lightFriendsButton;


    type Chat = {
        id: string;
        chatName: string;
        lastMessage: string;
        state: string;
    };
    const [chats, setChats] = useState<Chat[]>([]);
    async function gateChatsWithLastMessageAndStatus() {
        try {
            console.log("Requesting data");
            const response = await api.get('/chat/allChats');
            setChats(response.data);
            console.log("Server response: ", response.data);

            alert("Data recived sucessfully!");
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                alert("Some error hadnling.");
            } else if (error.request) {
                alert("Cannot connect with server.");
            } else {
                console.log("Ups... Something went wrong! ", error.message);
            }
        }
    }
    async function goToFriends() {
        router.push('/friends');
    }

    const CHATS = [
        {
            id: '1',
            name: 'My group chat',
            lastMessage: 'Just a message, nothing more there is no connections with other messages!',
        },
        {
            id: '2',
            name: 'MJ',
            lastMessage: 'Do we wanna make a smoke break?',
        },
        {
            id: '3',
            name: 'Bernard',
            lastMessage: '67676767676767',
        },
        {
            id: '4',
            name: 'Nidal',
            lastMessage: 'Want a cheesecake?',
        }
    ];
    type RecordProps = { name: string; lastMessage: string };
    const Record = ({ name, lastMessage }: RecordProps) => (
        <View style={[styles.contactBox, contactTheme]}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
            <View style={styles.data}>
                <Text style={[styles.contactText, contactTextTheme]}>{name}</Text>
                <Text style={[styles.sendedByText, sendedByTextTheme]}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{lastMessage}</Text>
            </View>
        </View>
    );

    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={stylesBackground.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <TouchableOpacity style={[styles.friendsButton, friendsButtonTheme]}
                    onPress={() => goToFriends()}>
                    <Text style={styles.friendsButtonText}>Friends</Text>
                </TouchableOpacity>
                <FlatList data={CHATS}
                    renderItem={({ item }) => <Record name={item.name} lastMessage={item.lastMessage} />}
                    keyExtractor={item => item.id.toString()} />
            </SafeAreaView>
        </LinearGradient>
    );
}