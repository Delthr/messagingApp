import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList, Image, Platform, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
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
                        <Text>prawa</Text>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}