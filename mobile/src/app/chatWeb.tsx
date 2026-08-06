import { getUserId } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './styles/baseStyle';
import styles from './styles/chatWebStyle';
// @ts-ignore
import { useChatSocket } from '@/utils/useChatSocket';
import api from '../utils/axioss';

export default function Index() {
    const { id: chatId } = useLocalSearchParams<{ id: string }>();
    const [inputText, setInputText] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const inputRef = useRef<TextInput>(null);
    const isSendingRef = useRef(false);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const { messages, setMessages, isConneected } = useChatSocket(chatId);
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    type Chat = {
        chatId: string;
        chatName: string;
        lastMessage: string;
        status: string;
    };

    async function gateChatsWithLastMessageAndStatus(): Promise<Chat[] | null> {
        try {
            const response = await api.get('/chat/allChats');
            return response.data;
        } catch (error: any) {
            console.log("Error fetching chats: ", error);
            return null;
        }
    };

    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(() => {
        async function fetchChatsWithLastMessages() {
            const chatsData = await gateChatsWithLastMessageAndStatus();
            if (chatsData) setChats(chatsData);
        };
        fetchChatsWithLastMessages();
    }, []);

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
        if (!text) return null;

        const isMessageSended = String(currentUserId) === String(senderId);

        return (
            <View style={[styles.messages, isMessageSended ? styles.myMessgae : styles.othersMessage]}>
                {showUsername && !isMessageSended && (
                    <Text style={styles.nickname}>{senderUsername || 'Użytkownik'}</Text>
                )}
                <Text style={styles.text}>{text}</Text>
                <Text style={styles.time}>{formatDateToTime(time)}</Text>
            </View>
        );
    };

    const Record = ({ chatId, chatName, lastMessage }: Chat) => (
        <TouchableOpacity style={styles.goToChatButton} onPress={() => goToChat(chatId)}>
            <View style={[styles.contactBox]}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.data}>
                    <Text style={[styles.contactText]}>{chatName}</Text>
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
                setPage(0);
                const response = await api.get(`/messages/${chatId}/messages?page=0`);
                const data = response.data;
                const content = data?.content || [];

                setMessages(content);
                setHasMore(!data?.last);
            } catch (error) {
                console.log('Error fetching history:', error);
                setMessages([]);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [chatId]);

    const fetchMoreMessages = async () => {
        if (loadingMore || !hasMore || !chatId || loadingHistory) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await api.get(`/messages/${chatId}/messages?page=${nextPage}`);
            const data = response.data;
            const newContent = data?.content || [];

            if (newContent.length > 0) {
                setMessages((prevMessages) => {
                    const currentList = Array.isArray(prevMessages) ? prevMessages : [];
                    const filteredNew = newContent.filter(
                        (newMsg: any) => !currentList.some((m) => String(m.id) === String(newMsg.id))
                    );
                    return [...currentList, ...filteredNew];
                });
                setPage(nextPage);
            }
            setHasMore(!data?.last);
        } catch (error) {
            console.log('Error fetching more messages:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const hanldeSendMessage = async () => {
        if (!inputText.trim() || isSendingRef.current) return;

        isSendingRef.current = true;
        const textToSend = inputText;
        setInputText('');

        try {
            const response = await api.post('/messages/send', {
                chatId: chatId,
                text: textToSend,
            });

            if (response.data) {
                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat.chatId === chatId
                            ? { ...chat, lastMessage: textToSend }
                            : chat
                    )
                );
            }
        } catch (error) {
            console.log('Error sending message: ', error);
        } finally {
            isSendingRef.current = false;

            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
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
                            data={chats}
                            renderItem={({ item }) => <Record chatId={item.chatId} chatName={item.chatName} lastMessage={item.lastMessage} status={item.status} />}
                            keyExtractor={item => item.chatId.toString()}
                        />
                    </View>
                    <View style={styles.subTableRight}>
                        <FlatList
                            inverted
                            data={Array.isArray(messages) ? messages : []}
                            keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
                            onEndReached={fetchMoreMessages}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={
                                loadingMore ? (
                                    <ActivityIndicator size="small" color="#888" style={{ marginVertical: 10 }} />
                                ) : null
                            }
                            renderItem={({ item, index }) => {
                                const olderMessage = Array.isArray(messages) ? messages[index + 1] : undefined;

                                const actualText = item.text || item.content || '';
                                const actualSenderId = item.senderId || item.userId || item.authorId || item.sender?.id;
                                const actualUsername = item.senderUsername || item.username || item.sender?.username || '';
                                const actualTime = item.sendetAt || item.createdAt || item.time || item.sentAt;

                                const olderSenderId = olderMessage?.senderId || olderMessage?.userId || olderMessage?.authorId || olderMessage?.sender?.id;
                                const showUsername = !olderMessage || olderSenderId !== actualSenderId;

                                return (
                                    <Message
                                        id={item.id}
                                        chatId={item.chatId}
                                        senderId={actualSenderId}
                                        senderUsername={actualUsername}
                                        text={actualText}
                                        time={actualTime}
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
                                    ref={inputRef}
                                    style={styles.typeText}
                                    placeholder='Message'
                                    value={inputText}
                                    onChangeText={setInputText}
                                    blurOnSubmit={false}
                                    returnKeyType="send"
                                    onSubmitEditing={Platform.OS !== 'web' ? hanldeSendMessage : undefined}
                                    onKeyPress={(e: any) => {
                                        if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                                            e.preventDefault();
                                            hanldeSendMessage();
                                        }
                                    }}
                                />
                            </View>
                            <View style={styles.sendButtonPlace}>
                                <TouchableOpacity
                                    onPress={hanldeSendMessage}
                                    {...Platform.select({ web: { onMouseDown: (e: any) => e.preventDefault() } })}
                                >
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