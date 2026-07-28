import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useState } from "react";
import { FlatList, Image, SafeAreaView, Text, useColorScheme, View } from "react-native";
import stylesBackground from './baseStyle';
import styles from './friendsStyles';

export default function Index() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    type Friend = {
        id: string,
        friendsUsername: string,
        friendsEmail: string,
        friendsStatus: string,
    }
    type RecordProps = { friendsUsername: string };
    const Record = ({ friendsUsername }: RecordProps) => (
        <View style={styles.friendBox}>
            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
            <View style={styles.friendData}>
                <Text style={styles.friendDataText}
                    ellipsizeMode='tail'
                    numberOfLines={1}>{friendsUsername}</Text>
            </View>
        </View>
    )

    const Friends = [
        {
            id: '1',
            friendsUsername: 'MJ',
            friendsEmail: 'mj@gmail.com',
            friendsStatus: 'ACCEPTED',
        },
        {
            id: '2',
            friendsUsername: 'Nidal',
            friendsEmail: 'cheescake@gmail.com',
            friendsStatus: 'ACCEPTED',
        },
        {
            id: '3',
            friendsUsername: 'Bernard',
            friendsEmail: 'bernard@gmail.com',
            friendsStatus: 'ACCEPTED',
        }
    ]

    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.content}>
                <View>
                    <Text>Friend list</Text>
                    <FlatList data={Friends}
                        renderItem={({ item }) => <Record friendsUsername={item.friendsUsername} />}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.row} />
                </View>
                <View>

                </View>

            </SafeAreaView>
        </LinearGradient>
    )
}