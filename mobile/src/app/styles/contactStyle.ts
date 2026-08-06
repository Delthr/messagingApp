import { StyleSheet } from "react-native";



export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 25,
        alignSelf: 'center',
    },
    text: {
        textAlign: 'center',
        lineHeight: 30,
    },
    backButton: {
        alignSelf: 'flex-start',
        borderWidth: 2,
        borderRadius: 40,
        margin: 10,
    },
    backButtonText: {
        marginLeft: 5,
        marginRight: 5,
    },
    gradientBackground: {
        flex: 1,
        width: '100%',
    },
    lightTheme: {
        color: '#fff'
    },
    darkTheme: {
        color: '#fff'
    },
    removeFriendButton: {
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 40,
        borderColor: 'red',
    },
    removeFriendButtonText: {
        color: 'red',
        margin: 5,
    },





    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#2A2A3E',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        color: '#ccc',
        marginBottom: 20,
    },
    closeButton: {
        borderWidth: 2,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
    },
    removeButton: {
        backgroundColor: '#ff0015',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
    },
    buttonsInPopUp: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
});

export default styles;