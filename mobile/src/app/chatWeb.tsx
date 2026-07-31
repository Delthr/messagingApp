import { getUserId } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { FlatList, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import stylesBackground from './styles/baseStyle';
import styles from './styles/chatWebStyle';

export default function Index() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

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


    type RecordProps = { id: string, name: string; lastMessage: string };
    const Record = ({ id, name, lastMessage }: RecordProps) => (
        <TouchableOpacity style={styles.goToChatButton} onPress={() => goToChat(id)}>
            <View style={[styles.contactBox]}>
                <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                <View style={styles.data}>
                    <Text style={[styles.contactText]}>{name}</Text>
                    <Text style={[styles.sendedByText]}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >{lastMessage}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    function formatDateToTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const messages = [
        {
            messageId: "msg-1",
            senderId: "user-2",
            senderUsername: "Alex standard",
            text: "Hey! How's the new project coming along?",
            sendetAt: "2026-07-30T12:00"
        },
        {
            messageId: "msg-2",
            senderId: "user-2",
            senderUsername: "Alex standard",
            text: "Did you manage to fix that layout issue in React Native?",
            sendetAt: "2026-07-30T12:01"
        },
        {
            messageId: "msg-3",
            senderId: "user-1", // Zastąp "user-1" swoim currentUserId, żeby przetestować prawe dymki
            senderUsername: "Me",
            text: "Yeah, got it sorted! Spent all day debugging it, but it works fine now.",
            sendetAt: "2026-07-30T12:03"
        },
        {
            messageId: "msg-4",
            senderId: "user-3",
            senderUsername: "Sarah Jenkins",
            text: "Awesome news! Is the backend ready for testing as well?",
            sendetAt: "2026-07-30T12:05"
        },
        {
            messageId: "msg-5",
            senderId: "user-3",
            senderUsername: "Sarah Jenkins",
            text: "We need to push this to production by tomorrow.",
            sendetAt: "2026-07-30T12:06"
        },
        {
            messageId: "msg-6",
            senderId: "user-1",
            senderUsername: "Me",
            text: "Almost! Just finishing up the messaging features and we're good to go. 🚀",
            sendetAt: "2026-07-30T12:10"
        },
        {
            messageId: "msg-7",
            senderId: "user-1",
            senderUsername: "Me",
            text: "Almost! Just finishing up the messaging features and we're good to go. ",
            sendetAt: "2026-07-30T12:10"
        },
    ];


    type MessageProps = {
        messageId: string,
        senderId: string,
        senderUsername: string,
        text: string,
        sendetAt: string,
        showUsername: boolean,
    };


    const Message = ({ messageId, senderId, senderUsername, text, sendetAt, showUsername }: MessageProps) => {
        const [currentUserId, setCurrentUserId] = useState<string | null>(null);
        useEffect(() => {
            const fetchUserId = async () => {
                const userId = await getUserId();
                setCurrentUserId(userId);
            };

            fetchUserId();
        }, []);
        // zmien user 1 na currnetUserId
        const isMessageSended = "user-1" === senderId;
        return (
            <View style={[styles.messages, isMessageSended ? styles.myMessgae : styles.othersMessage]}>
                {showUsername && !isMessageSended && (
                    <Text style={styles.nickname}>{senderUsername}</Text>
                )}
                <Text style={styles.text}>{text}</Text>
                <Text style={styles.time}>{formatDateToTime(sendetAt)}</Text>
            </View>
        )
    };
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
                            data={messages}
                            keyExtractor={(item) => item.messageId}

                            renderItem={({ item, index }) => {
                                const previousMessage = messages[index - 1];
                                const showUsername = !previousMessage || previousMessage.senderId !== item.senderId;

                                return (
                                    <Message
                                        messageId={item.messageId}
                                        senderId={item.senderId}
                                        senderUsername={item.senderUsername}
                                        text={item.text}
                                        sendetAt={item.sendetAt}
                                        showUsername={showUsername}
                                    />
                                );
                            }}
                        />
                        <View style={styles.createMessageBar}>
                            <View style={styles.typePlace}>
                                <TextInput style={styles.typeText} placeholder='Message'>

                                </TextInput>
                            </View>
                            <View style={styles.sendButtonPlace}>
                                <TouchableOpacity onPress={() => console.log('Sending message!')}>
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