import { getUserId } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './styles/baseStyle';
import styles from './styles/chatWebStyle';
// @ts-ignore
import { useChatSocket } from '@/utils/useChatSocket';
import api from '../utils/axioss';

if (typeof globalThis.TextEncoder === 'undefined') {
    globalThis.TextEncoder = TextEncoder;
    globalThis.TextDecoder = TextDecoder;
}

function formatDateToTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

type MessageProps = {
    id: string;
    chatId: string;
    senderId: string;
    senderUsername: string;
    text: string;
    time: string;
    status: string;
    showUsername: boolean;
    currentUserId: string | null;
};

const Message = ({ senderId, senderUsername, text, time, showUsername, currentUserId }: MessageProps) => {
    const isMessageSended = currentUserId === senderId;
    return (
        <View style={[styles.messages, isMessageSended ? styles.myMessgae : styles.othersMessage]}>
            {showUsername && !isMessageSended && (
                <Text style={styles.nickname}>{senderUsername}</Text>
            )}
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.time}>{formatDateToTime(time)}</Text>
        </View>
    );
};

export default function Index() {
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const [inputText, setInputText] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const { messages, setMessages, isConneected } = useChatSocket(chatId);
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    const CHATS = [
        {
            id: '1',
            name: '1234567890123456789012345',
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

    type RecordProps = { id: string; name: string; lastMessage: string };
    const Record = ({ id, name, lastMessage }: RecordProps) => (
        <TouchableOpacity style={styles.goToChatButton} onPress={() => goToChat(id)}>
            <View style={[styles.contactBox]}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.data}>
                    <Text style={[styles.contactText]}>{name}</Text>
                    <Text style={[styles.sendedByText]} numberOfLines={1} ellipsizeMode='tail'>
                        {lastMessage}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await getUserId();
            setCurrentUserId(userId);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!chatId) return;

        const fetchHistory = async () => {
            try {
                setLoadingHistory(true);
                const response = await api.get(`/messages/${chatId}/messages`);
                console.log('Pobrane wiadomości z API:', response.data);


                const dataArray = Array.isArray(response.data)
                    ? response.data
                    : (response.data?.content || []);

                setMessages(dataArray);
            } catch (error) {
                console.log('Error fetching history:', error);
                setMessages([]);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [chatId]);

    const hanldeSendMessage = async () => {
        if (!inputText.trim()) return;
        const textToSend = inputText;
        setInputText('');

        try {
            const response = await api.post('/messages/send', {
                chatId: chatId,
                text: textToSend,
            });

            if (response.data) {
                setMessages((prevMessages: any) => {
                    const currentList = Array.isArray(prevMessages) ? prevMessages : [];
                    return [...currentList, response.data];
                });
            }
        } catch (error) {
            console.log('Error message: ', error);
        }
    };

    function goToChat(newChatId: string) {
        if (Platform.OS === 'web') {
            router.setParams({ id: newChatId });
        } else {
            router.push({
                pathname: '/chatMobile',
                params: { id: newChatId },
            });
        }
    }

    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={stylesBackground.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.table}>
                    <View style={styles.subTableLeft}>
                        <FlatList
                            data={CHATS}
                            renderItem={({ item }) => <Record id={item.id} name={item.name} lastMessage={item.lastMessage} />}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                    <View style={styles.subTableRight}>
                        <FlatList
                            data={Array.isArray(messages) ? messages : []}
                            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
                            renderItem={({ item, index }) => {
                                const previousMessage = Array.isArray(messages) ? messages[index - 1] : undefined;
                                const showUsername = !previousMessage || previousMessage.senderId !== item.senderId;

                                return (
                                    <Message
                                        id={item.id}
                                        chatId={item.chatId}
                                        senderId={item.senderId}
                                        senderUsername={item.senderUsername}
                                        text={item.text}
                                        time={item.sendetAt || item.createdAt || item.time}
                                        status={item.status}
                                        showUsername={showUsername}
                                        currentUserId={currentUserId}
                                    />
                                );
                            }}
                        />
                        <View style={styles.createMessageBar}>
                            <View style={styles.typePlace}>
                                <TextInput
                                    style={styles.typeText}
                                    placeholder='Message'
                                    value={inputText}
                                    onChangeText={setInputText}
                                />
                            </View>
                            <View style={styles.sendButtonPlace}>
                                <TouchableOpacity onPress={hanldeSendMessage}>
                                    <Image source={require('../../assets/images/sendIcon.png')} style={styles.avatar} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}