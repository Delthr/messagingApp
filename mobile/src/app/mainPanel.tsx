import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
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
    };
    async function goToRequests() {
        router.push('/requests');
    };

    async function moveToContactPage(id: string, username: string, email: string) {
        router.push({
            pathname: '/contact',
            params: {
                id: id,
                username: username,
                email: email,
            },
        });
    };
    type Chat = {
        chatId: string;
        chatName: string;
        lastMessage: string;
        status: string;
    };
    async function gateChatsWithLastMessageAndStatus(): Promise<Chat[] | null> {
        try {
            console.log("Requesting data");
            const response = await api.get('/chat/allChats');
            console.log(response.data);
            console.log("Data recived sucessfully!");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
                alert("Some error hadnling.");
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

    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
        async function fetchChatsWithLastMessages() {
            const chats = await gateChatsWithLastMessageAndStatus();
            if (chats) {
                setChats(chats);
            }
        };
        fetchChatsWithLastMessages();
    }, []);

    type Friend = {
        email: string,
        id: string,
        username: string,
    };
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
    );


    const Record = ({ chatId, chatName, lastMessage, status }: Chat) => (
        <TouchableOpacity style={styles.goToChatButton} onPress={() => goToChat(chatId)}>
            <View style={[styles.contactBox, contactTheme]}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.data}>
                    <Text style={[styles.contactText, contactTextTheme]}>{chatName}</Text>
                    <Text style={[styles.sendedByText, sendedByTextTheme]}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{lastMessage}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );








    async function getFriends(): Promise<Friend[] | null> {
        try {
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
    };

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


    type SearchResults = { email: string; id: string; username: string; };
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults[]>([]);

    const searchUser = async (searchUsername: string) => {
        setQuery(searchUsername);
        if (!searchUsername.trim()) {
            setResults([]);
            return;
        }

        try {
            const response = await api.get('/findAUserId', {
                params: { userName: searchUsername }
            });
            const targetedUser: SearchResults = response.data;
            console.log(response.data);
            if (targetedUser && targetedUser.id) {
                setResults([targetedUser]);
                console.log("User has been found! : ", targetedUser.username);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error(error);
            setResults([]);
        }
    };

    const addUser = async (targetedId: string) => {
        if (!targetedId) return;
        try {
            await api.post('/friends/sendRequest', targetedId, {
                headers: { 'Content-Type': 'text/plain' }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const createChat = async (friend: Friend) => {
        try {
            const response = await api.post('/chat/create', {
                email: friend.email,
                id: friend.id,
                username: friend.username,
            })
        } catch (error) {
            console.error(error);
        }
    };

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
                                onChangeText={(text) => searchUser(text)}
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
                                                    addUser(item.id);
                                                    setQuery('');
                                                    setResults([]);
                                                }}
                                            >
                                                <Text style={styles.dropdownText}>{item.username}</Text>
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
                        <TouchableOpacity onPress={() => goToRequests()}>
                            <View style={styles.requestBox}>
                                <Text style={styles.requestsButtonText}>
                                    Requests
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.subTableRight}>
                        <FlatList
                            data={chats}
                            renderItem={({ item }) => <Record chatId={item.chatId} chatName={item.chatName} lastMessage={item.lastMessage} status={item.status} />}
                            keyExtractor={item => item.chatId.toString()}
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.addChatButton} onPress={() => setIsModalVisible(true)}>
                    <Image source={require('../../assets/images/plus.png')} style={styles.avatar} />
                </TouchableOpacity>

                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalVisible(false)}>
                        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>

                            <Text style={styles.modalTitle}>Create a chat: </Text>

                            <FlatList
                                data={friends}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.friendRow}>
                                        <View style={styles.friendInfo}>
                                            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                                            <Text style={styles.username}>{item.username}</Text>
                                        </View>

                                        <TouchableOpacity style={styles.actionButton} onPress={() => createChat(item)}>
                                            <Image source={require('../../assets/images/plus.png')} style={styles.smallIcon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Zamknij</Text>
                            </TouchableOpacity>

                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
}