import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    requestBox: {
        borderWidth: 2,
        borderColor: '#7a7663',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        marginRight: 10,
    },
    data: {
        flexDirection: 'column',
    },
    usernameText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emailText: {
        color: '#ccc',
        fontSize: 12,
    },
    acceptButton: {
        color: '#fff',
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 30,
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
});

export default styles;