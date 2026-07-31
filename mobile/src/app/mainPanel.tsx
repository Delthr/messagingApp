import { getToken } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import api from '../utils/axioss';
import stylesBackground from './styles/baseStyle';
import styles from './styles/mainPanelStyles';

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


    async function moveToContactPage(id: string, username: string, email: string) {
        router.push({
            pathname: '/contact',
            params: {
                id: id,
                username: username,
                email: email,
            },
        });
    }
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

    type Friend = {
        email: string,
        id: string,
        username: string,
    }
    type RecordPropsFriends = { email: string, id: string, username: string };
    const RecordFriends = ({ email, id, username }: RecordPropsFriends) => (
        <TouchableOpacity style={styles.goToContactButton} onPress={() => moveToContactPage(id, username, email)}>
            <View style={styles.friendBox}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.friendData}>
                    <Text style={styles.friendDataText}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
    const CHATS = [
        {
            id: '1',
            name: 'My group chat',
            lastMessage: 'Just a message, nothing more there is no co',
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

    type RecordProps = {
        id: string,
        name: string,
        lastMessage: string
    };
    const Record = ({ id, name, lastMessage }: RecordProps) => (
        <TouchableOpacity style={styles.goToChatButton} onPress={() => goToChat(id)}>
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
        </TouchableOpacity>
    );


    async function moveToRequests() {
        router.push('/requests');
    }

    async function goToChat(chatId: string) {
        if (Platform.OS === 'web') {
            router.push({
                pathname: '/chatWeb',
                params: {
                    id: chatId,
                },
            });
        } else {
            router.push({
                pathname: '/chatMobile',
                params: {
                    id: chatId,
                }
            });
        }
    }

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ id: string; name: string }[]>([]);

    const allUsers = [
        { id: '1', name: 'Jola' },
        { id: '2', name: 'Jake' },
        { id: '3', name: 'John' },
        { id: '4', name: 'Alice' },
    ];

    const handleSearch = (text: string) => {
        setQuery(text);
        if (text.length > 0) {
            const filtered = allUsers.filter(user =>
                user.name.toLowerCase().includes(text.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    };

    async function sendRequestToFriends(username: string) {
        console.log("Added friend: ", username)
    }




    async function getFriends(): Promise<Friend[] | null> {
        try {
            const token = await getToken();
            console.log("Getting Friends list");
            const response = await api.get('/friends/friendsList');
            console.log("friends loaded!")
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
    }

    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        async function fetchFriends() {
            const data = await getFriends();
            if (data) {
                setFriends(data);
            }
        };
        fetchFriends();
    }, []);

    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={stylesBackground.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.table}>
                    <View style={styles.subTableLeft}>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Search for friends..."
                                placeholderTextColor="#ccc"
                                value={query}
                                onChangeText={handleSearch}
                            />

                            {query.length > 0 && (
                                <View style={styles.dropdown}>
                                    <FlatList
                                        data={results}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    sendRequestToFriends(item.name);
                                                    setQuery('');
                                                    setResults([]);
                                                }}
                                            >
                                                <Text style={styles.dropdownText}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={
                                            <Text style={styles.emptyText}>No results</Text>
                                        }
                                    />
                                </View>
                            )}
                        </View>
                        <FlatList data={friends}
                            renderItem={({ item }) => <RecordFriends email={item.email} id={item.id} username={item.username} />}
                            keyExtractor={item => item.id.toString()}
                            numColumns={1} />
                        <TouchableOpacity onPress={() => moveToRequests()}>
                            <View style={styles.requestBox}>
                                <Text style={styles.requestsButtonText}>
                                    Requests
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.subTableRight}>
                        <FlatList
                            data={CHATS}
                            renderItem={({ item }) => <Record id={item.id} name={item.name} lastMessage={item.lastMessage} />}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}