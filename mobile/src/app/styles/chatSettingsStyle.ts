import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    chatIcon: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    text: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    renameButton: {
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    renameText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
    },
    chatUsersList: {
        width: '50%',
        minWidth: 267,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ffffff40',
        marginBottom: 20,
    },
    table: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff20',
    },
    username: {
        color: '#fff',
        fontSize: 16,
    },
    deleteUserButton: {
        padding: 5,
    },
    deleteUser: {
        fontSize: 16,
    },
    addUserButton: {
        width: '20%',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
        paddingVertical: 10,
        marginBottom: 12,
        alignItems: 'center',
    },
    addUserText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        width: '20%',
        borderColor: '#f05050bb',
        borderWidth: 2,
        borderRadius: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    deleteText: {
        color: '#f05050bb',
        fontWeight: 'bold',
    },
    renameChatPopup: {
        width: '40%',
        height: '40%',

    },
    modalCloseButton: {
        borderRadius: 20,
        borderColor: '#f05050bb',
        borderWidth: 2,
    },
    quit: {
        color: '#f05050bb',
        marginLeft: 5,
        marginRight: 5,
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffff',
    },
    newChatName: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#fff",
        color: '#ffff',
        marginBottom: 10,
    },
    changeNameButton: {
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#fff',
        marginBottom: 10,
    },
    changeNameButtonText: {
        color: '#fff',
        marginLeft: 5,
        marginRight: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteModalContainer: {
        width: '80%',
        backgroundColor: '#3a3a3a',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    deleteModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
    },
    deleteModalText: {
        fontSize: 15,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    yesButton: {
        backgroundColor: '#ff4d4d',
    },
    noButton: {
        backgroundColor: '#cccccc',
    },
    confirmButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlayAdd: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        maxHeight: '70%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitleAdd: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    usernameAdd: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    actionButton: {
        padding: 8,
    },
    smallIcon: {
        width: 24,
        height: 24,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },
    backButton: {
        alignSelf: 'flex-start',
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 20,
        margin: 20,
    },
    backButtonText: {
        color: '#fff',
        marginLeft: 5,
        marginRight: 5,
    },
});

export default styles;