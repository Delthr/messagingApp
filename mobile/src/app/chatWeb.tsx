import { getUserId } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './styles/baseStyle';
import styles from './styles/chatWebStyle';
// @ts-ignore
import { useChatSocket } from '@/utils/useChatSocket';
import { x25519 } from '@noble/curves/ed25519.js';
import api from '../utils/axioss';
import { decryptIncomingMessage, decryptMessage, decryptParticipantKey, encryptMessgae, encryptParticipantKey, ensureUserHasKeys, getPrivateKeyLocaly } from '../utils/cryptoService';

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
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [myPrivateKey, setMyPrivateKey] = useState<string | null>(null);

    const { messages, setMessages } = useChatSocket(chatId, currentUserId, myPrivateKey);
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const lightGradient = ['rgb(89, 94, 96)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    const bytesToHex = (bytes: Uint8Array): string =>
        Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    const hexToBytes = (hex: string): Uint8Array => {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return bytes;
    };

    useEffect(() => {
        const initAuthData = async () => {
            try {
                const [userId, privKey] = await Promise.all([
                    getUserId(),
                    getPrivateKeyLocaly(),
                ]);
                setCurrentUserId(userId);
                setMyPrivateKey(privKey);
            } catch (error) {
                console.error("Error during loading identity: ", error);
            }
        };
        initAuthData();
    }, []);

    interface Participant {
        id: string;
        username: string;
        publicKey: string;
    }

    useEffect(() => {
        const loadParticipants = async () => {
            try {
                const response = await api.get(`/chat/${chatId}/participants`);
                setParticipants(response.data);
            } catch (error) {
                console.error('Error during getting participants', error);
            }
        };
        if (chatId) {
            loadParticipants();
        }
    }, [chatId]);

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
            await ensureUserHasKeys();

            const response = await api.get('/chat/allChats');
            const privKey = await getPrivateKeyLocaly();

            if (!privKey) {
                console.warn("No private key.");
                return response.data;
            }

            if (!Array.isArray(response.data)) return response.data;

            return await Promise.all(
                response.data.map(async (chat: any) => {
                    if (!chat.lastMessage || !chat.lastMessageIv || !chat.encryptedKeys) {
                        return chat;
                    }

                    try {
                        const keysMap: Record<string, string> = typeof chat.encryptedKeys === 'string'
                            ? JSON.parse(chat.encryptedKeys)
                            : chat.encryptedKeys;

                        let messageKeyHex: string | null = null;


                        for (const [userId, packet] of Object.entries(keysMap)) {
                            if (typeof packet === 'string' && packet.includes(':')) {
                                try {
                                    const decryptedKey = await decryptParticipantKey(packet, privKey);
                                    if (decryptedKey) {
                                        messageKeyHex = decryptedKey;
                                        break;
                                    }
                                } catch (packetError) {
                                    continue;
                                }
                            }
                        }

                        if (!messageKeyHex) {
                            console.warn(`No key found for chat: ${chat.chatName || chat.chatId}`);
                            return chat;
                        }

                        const decryptedText = await decryptMessage(chat.lastMessage, chat.lastMessageIv, messageKeyHex);

                        return {
                            ...chat,
                            lastMessage: decryptedText || chat.lastMessage
                        };
                    } catch (e) {
                        console.error(`Error in decryption in chat:  ${chat.chatName || chat.chatId}:`, e);
                        return chat;
                    }
                })
            );
        } catch (error: any) {
            console.error("Error during downloading chats:  ", error);
            return null;
        }
    }

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


    const decryptMessageList = async (rawMessages: any[]) => {
        if (!currentUserId || !myPrivateKey) return rawMessages;

        return await Promise.all(rawMessages.map(async (msg) => {
            if (msg.text && msg.iv && msg.encryptedKeys) {
                const decryptedText = await decryptIncomingMessage(msg, currentUserId, myPrivateKey);
                return { ...msg, text: decryptedText };
            }
            return msg;
        }))
    };

    useEffect(() => {
        if (!chatId || !currentUserId || !myPrivateKey) return;

        const fetchHistory = async () => {
            try {
                setLoadingHistory(true);
                setMessages([]);
                setPage(0);
                const response = await api.get(`/messages/${chatId}/messages?page=0`);
                const data = response.data;
                const content = data?.content || [];

                const decryptedContent = await decryptMessageList(content);

                setMessages(decryptedContent);
                setHasMore(!data?.last);
            } catch (error) {
                console.log('Error fetching history:', error);
                setMessages([]);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [chatId, currentUserId, myPrivateKey]);


    const fetchMoreMessages = async () => {
        if (loadingMore || !hasMore || !chatId || loadingHistory) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await api.get(`/messages/${chatId}/messages?page=${nextPage}`);
            const data = response.data;
            const newContent = data?.content || [];

            if (newContent.length > 0) {
                const decryptedNew = await decryptMessageList(newContent);
                setMessages((prevMessages) => {
                    const currentList = Array.isArray(prevMessages) ? prevMessages : [];
                    const filteredNew = decryptedNew.filter(
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


    useEffect(() => {
        if (!currentUserId || !myPrivateKey || messages.length === 0) return;

        const decryptExistingMessages = async () => {
            let hasChanges = false;
            const updated = await Promise.all(
                messages.map(async (msg) => {
                    if (msg.text && msg.iv && msg.encryptedKeys) {
                        const decryptedText = await decryptIncomingMessage(msg, currentUserId, myPrivateKey);
                        if (decryptedText !== msg.text) {
                            hasChanges = true;
                            return { ...msg, text: decryptedText };
                        }
                    }
                    return msg;
                })
            );

            if (hasChanges) {
                setMessages(updated);
            }
        };

        decryptExistingMessages();
    }, [currentUserId, myPrivateKey]);


    const hanldeSendMessage = async () => {
        if (showEmojiPicker) setShowEmojiPicker(false);
        if (!inputText.trim() || isSendingRef.current) return;

        isSendingRef.current = true;
        const textToSend = inputText;
        setInputText('');

        try {
            const randomBytes = crypto.getRandomValues(new Uint8Array(32));
            const messageKeyHex = bytesToHex(randomBytes);
            const { encryptedText, iv } = await encryptMessgae(textToSend, messageKeyHex);


            const response = await api.get(`/chat/${chatId}/participants`);
            const freshParticipants: Participant[] = response.data;

            const encryptedKeys: Record<string, string> = {};

            for (const participant of freshParticipants) {
                let recipientPublicKey = participant.publicKey;


                const isMe = currentUserId && String(participant.id) === String(currentUserId);
                if (isMe && myPrivateKey) {
                    const myPrivateKeyBytes = hexToBytes(myPrivateKey);
                    const myPublicKeyBytes = x25519.getPublicKey(myPrivateKeyBytes);
                    recipientPublicKey = bytesToHex(myPublicKeyBytes);
                }

                if (!recipientPublicKey) {
                    console.warn(`User ${participant.username || participant.id} has no public key!`);
                    continue;
                }

                encryptedKeys[participant.id] = await encryptParticipantKey(messageKeyHex, recipientPublicKey);
            }

            await api.post('/messages/send', {
                chatId: chatId,
                text: encryptedText,
                iv: iv,
                encryptedKeys: encryptedKeys,
            });

            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.chatId === chatId ? { ...chat, lastMessage: textToSend } : chat
                )
            );

        } catch (error) {
            console.log('Error sending message: ', error);
            setInputText(textToSend);
        } finally {
            isSendingRef.current = false;
            setTimeout(() => inputRef.current?.focus(), 10);
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


    const sortedMessages = [...messages].sort((a, b) => {
        const timeA = new Date(a.time || a.createdAt).getTime();
        const timeB = new Date(b.time || b.createdAt).getTime();
        return timeB - timeA;
    });

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
                            data={sortedMessages}
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