import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    contactBox: {
        width: '100%',
        maxWidth: 390,
        borderBlockColor: '#fff',
        borderRadius: 20,
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
    },
    darkContactBox: {

    },
    lightContactBox: {

    },

    // 
    contactText: {
        marginLeft: 5,
        marginRight: 5,
    },
    darkContactText: {

    },
    lightContactText: {

    },

    // 
    sendedByText: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: 10,
    },
    darkSendedByText: {

    },
    lightSendedByText: {

    },

    // 
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },

    // 
    data: {
        flex: 1,
        flexShrink: 1,
    },

    // 
    friendsButton: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 5,
        borderRadius: 25,
        borderColor: '#ffffff',
        borderWidth: 2,
    },
    darkFriendsButton: {

    },
    lightFriendsButton: {

    },
    friendsButtonText: {
        marginLeft: 5,
        marginRight: 5,
    },
});
export default styles;
