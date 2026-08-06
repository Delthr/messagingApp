import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from "react";
import { Image, Modal, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import api from '../utils/axioss';
import stylesBackground from './styles/baseStyle';
import styles from './styles/contactStyle';


export default function Index() {


    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const theme = isDarkMode ? stylesBackground.darkTheme : stylesBackground.lightTheme;

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;


    const { id, username, email } = useLocalSearchParams<{ id: string; username: string; email: string }>();

    async function getBack() {
        router.push('/mainPanel');
    }
    const [modalVisible, setModalVisible] = useState(false);

    async function removeFriend(id: string) {
        try {
            const response = await api.post('/friends/remove', {
                friendsId: id,
            })
            console.log("friend has been removed!");
            setModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <LinearGradient style={styles.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View>
                    <TouchableOpacity style={styles.backButton} onPress={() => getBack()}>
                        <Text style={styles.backButtonText}>
                            Back
                        </Text>
                    </TouchableOpacity>
                    <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                    <Text style={styles.text}>
                        {username}{"\n"}
                        {email}
                    </Text>
                    <TouchableOpacity style={styles.removeFriendButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.removeFriendButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Are you sure you want to remove {username} from your friends list?</Text>
                            <View style={styles.buttonsInPopUp}>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeFriend(id)}
                                >
                                    <Text style={{ color: '#fff' }}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={{ color: '#fff' }}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient >
    );
}