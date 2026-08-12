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

import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

export default function Index() {
    const { id: chatId, } = useLocalSearchParams<{ id: string }>();
    const [inputText, setInputText] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const inputRef = useRef<TextInput>(null);
    const isSendingRef = useRef(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

    function handleEmojiClick(emojiData: EmojiClickData) {
        setInputText((prev) => prev + emojiData.emoji);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 10);
    };

    useEffect(() => {
        if (Platform.OS !== 'web') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowEmojiPicker(false);
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    async function gateChatsWithLastMessageAndStatus(): Promise<Chat[] | null> {
        try {
            const response = await api.get('/chat/allChats');
            console.log(response.data);
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
            if (chatsData) {
                const uniqueChats = Array.from(
                    new Map(chatsData.map(item => [item.chatId, item])).values()
                );
                setChats(uniqueChats);
            };
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
                const res = response.data;

                const normalizedMessage = {
                    id: res.id || res.messageId || Date.now().toString(),
                    chatId: res.chatId || chatId,
                    text: res.text || res.content || textToSend,
                    senderId: res.senderId || res.userId || res.authorId || currentUserId,
                    senderUsername: res.senderUsername || res.username || '',
                    time: res.time || res.createdAt || res.sendetAt || new Date().toISOString(),
                    status: res.status || 'SENT'
                };

                setChats(prevChats =>
                    prevChats.map(chat =>
                        chat.chatId === chatId
                            ? { ...chat, lastMessage: textToSend }
                            : chat
                    )
                );

                setMessages((prevMessages: any[]) => {
                    const currentList = Array.isArray(prevMessages) ? prevMessages : [];
                    const alreadyExists = currentList.some(
                        (msg) => String(msg.id) === String(normalizedMessage.id)
                    );

                    if (alreadyExists) return currentList;
                    return [normalizedMessage, ...currentList];
                });
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

    function goToChatSettings(chatIdToPass: string, chatNameToPass: string) {
        router.push({
            pathname: '/chatSettings',
            params: {
                id: chatIdToPass,
                chatName: chatNameToPass,
            },
        });
    }
    const chatName = chats.find(e => e.chatId === chatId)?.chatName ?? '';


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
                        <View style={styles.topSubTableRight}>

                            <Image source={require('../../assets/images/chatIcon.png')} style={styles.chatIcon} />
                            <Text style={styles.chatName}>{chatName}</Text>
                            <TouchableOpacity onPress={() => goToChatSettings(chatId, chatName)}>
                                <Image style={styles.more} source={require('../../assets/images/more.png')} />
                            </TouchableOpacity>

                        </View>
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

                        {showEmojiPicker && Platform.OS === 'web' && (
                            <View
                                style={{ position: 'absolute', bottom: 70, right: 60, zIndex: 1000 }}
                                {...Platform.select({ web: { onMouseDown: (e: any) => e.preventDefault() } })}
                            >
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    theme={isDarkMode ? ('dark' as any) : ('light' as any)}
                                />
                            </View>
                        )}

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
                            <TouchableOpacity
                                style={styles.emojiButtonPlace}
                                onPress={() => {
                                    setShowEmojiPicker((prev) => !prev);
                                    setTimeout(() => inputRef.current?.focus(), 10);
                                }}
                                {...Platform.select({ web: { onMouseDown: (e: any) => e.preventDefault() } })}
                            >
                                <Text style={{ fontSize: 20 }}>😀</Text>
                            </TouchableOpacity>
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