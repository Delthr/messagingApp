import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import api from '../utils/axioss';
import stylesBackground from './styles/baseStyle';
import styles from './styles/chatSettingsStyle';
export default function ChatSetting() {
    const { id: chatId, chatName } = useLocalSearchParams<{ id: string; chatName: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const lightGradient = ['rgb(180, 234, 251)', 'rgb(248, 208, 190)'] as const;
    const darkGradient = ['rgb(12, 2, 55)', 'rgb(54, 17, 43)'] as const;
    const gradientK = isDarkMode ? darkGradient : lightGradient;

    const [isChatNameWindowVisable, setChatNameWindowVisable] = useState(false);
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loadingFriends, setLoadingFriends] = useState<boolean>(true);
    const [newChatName, setNewChatName] = useState<string>('');
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isAddModalVisable, setAddModalVisibility] = useState(false);

    function goBackToChat() {
        router.push({
            pathname: '/chatWeb',
            params: { id: chatId },
        })
    }

    async function changeName() {
        if (newChatName === '') return;
        try {
            api.post(`/chat/changeChatName`, {
                newChatName: newChatName,
                chatId: chatId,
            })
        } catch (error) {
            console.log(error);
        } finally {
            setNewChatName('');
            setChatNameWindowVisable(false);
        }
    }
    async function getAllChatUsers() {
        if (!chatId) return;
        try {
            setLoadingUsers(true);
            const respone = await api.get(`/chat/${chatId}/getAllChatUsers`);
            setUsers(respone.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingUsers(false);
        }
    }

    async function getFriendsList() {
        if (!chatId) return;

        try {
            setLoadingFriends(true);
            const response = await api.get(`/friends/friendsList`);
            setFriends(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingFriends(false);
        }

    }
    async function deleteUserFromChat(usernameToBeDeleted: string) {
        try {
            await api.delete(`/chat/${chatId}/deleteUserFromChat/${usernameToBeDeleted}`);
            setUsers(prevUsers => prevUsers.filter(user => user.username !== usernameToBeDeleted))
        } catch (error) {
            console.error(error);
        }
    }
    async function addUserToChat(username: string) {
        try {
            await api.post(`/chat/add`, {
                chatId: chatId,
                username: username,
            })
            setAddModalVisibility(false);
            await getAllChatUsers();
        } catch (error) {
            console.error(error);
        }
    }
    async function deleteChat() {
        if (!chatId) return;

        try {
            await api.delete(`/chat/${chatId}/deleteChat`);
            router.replace('/mainPanel');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllChatUsers();
    }, [chatId]);

    useEffect(() => {
        getFriendsList();
    }, [chatId]);

    type Friend = {
        id: string,
        username: string,
        email: string,
    }

    type ChatUser = {
        id: string,
        username: string,
    };
    const Record = ({ id, username }: ChatUser) => (
        <View style={styles.table}>
            <Text style={styles.username}>{username}</Text>
            <TouchableOpacity style={styles.deleteUserButton} onPress={() => deleteUserFromChat(username)}>
                <Text style={styles.deleteUser}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <LinearGradient style={stylesBackground.gradientBackground} colors={gradientK} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <SafeAreaView>
                <TouchableOpacity style={styles.backButton} onPress={() => goBackToChat()}>
                    <Text style={styles.backButtonText}>
                        Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView style={stylesBackground.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.container}>
                    <Image source={require('../../assets/images/chatIcon.png')} style={styles.chatIcon} />
                    <Text style={styles.text}>{chatName}</Text>
                    <TouchableOpacity style={styles.renameButton} onPress={() => setChatNameWindowVisable(true)}>
                        <Text style={styles.renameText}>Rename</Text>
                    </TouchableOpacity>
                    <Modal style={styles.renameChatPopup}
                        animationType="slide"
                        transparent={true}
                        visible={isChatNameWindowVisable}
                        onRequestClose={() => setChatNameWindowVisable(false)}
                    >
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Rename chat</Text>
                            <TextInput style={styles.newChatName}
                                placeholder="Enter new chat name..."
                                value={newChatName}
                                onChangeText={setNewChatName} />
                            <TouchableOpacity style={styles.changeNameButton}
                                onPress={changeName}>
                                <Text style={styles.changeNameButtonText}>
                                    Rename
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setChatNameWindowVisable(false)}
                            >
                                <Text style={styles.quit}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <FlatList style={styles.chatUsersList}
                        data={users}
                        renderItem={({ item }) => <Record id={item.id.toString()} username={item.username} />}
                        keyExtractor={item => item.id.toString()} />
                </View>
                <TouchableOpacity style={styles.addUserButton} onPress={() => setAddModalVisibility(true)}>
                    <Text style={styles.addUserText}>Add user</Text>
                </TouchableOpacity>
                <Modal
                    visible={isAddModalVisable}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setAddModalVisibility(false)}
                >
                    <TouchableOpacity style={styles.modalOverlayAdd} activeOpacity={1} onPress={() => setAddModalVisibility(false)}>
                        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>

                            <Text style={styles.modalTitle}>Create a chat: </Text>

                            <FlatList
                                data={friends}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={styles.friendRow}>
                                        <View style={styles.friendInfo}>
                                            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                                            <Text style={styles.usernameAdd}>{item.username}</Text>
                                        </View>

                                        <TouchableOpacity style={styles.actionButton} onPress={() => addUserToChat(item.username)}>
                                            <Image source={require('../../assets/images/plus.png')} style={styles.smallIcon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />

                            <TouchableOpacity style={styles.closeButton} onPress={() => setAddModalVisibility(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>

                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
                <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteModalVisible(true)}>
                    <Text style={styles.deleteText}>Delete chat!</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isDeleteModalVisible}
                    onRequestClose={() => setDeleteModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.deleteModalContainer}>
                            <Text style={styles.deleteModalTitle}>Delete Chat</Text>
                            <Text style={styles.deleteModalText}>Are you sure you wanna delete this chat?</Text>

                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.yesButton]}
                                    onPress={deleteChat}
                                >
                                    <Text style={styles.confirmButtonText}>Yes</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.confirmButton, styles.noButton]}
                                    onPress={() => setDeleteModalVisible(false)}
                                >
                                    <Text style={styles.confirmButtonText}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
}