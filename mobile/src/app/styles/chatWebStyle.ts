import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    table: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
    },
    topSubTableRight: {
        borderWidth: 2,
        borderRadius: 8,
        borderColor: "#919090dc",
        flexDirection: 'row',
    },
    subTableLeft: {
        minWidth: 180,
        width: '20%',
        paddingHorizontal: 8,
    },
    subTableRight: {
        flex: 1,
        paddingHorizontal: 12,
    },
    goToChatButton: {

    },
    contactBox: {
        width: '100%',
        borderColor: '#707070',
        borderRadius: 20,
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
        marginBottom: 8,
    },
    contactText: {
        color: '#ffffff',
        marginLeft: 5,
        marginRight: 5,
        fontSize: Math.max(14, width * 0.012),
    },
    darkContactText: {},
    lightContactText: {},

    sendedByText: {
        color: '#dcdde0',
        marginLeft: 5,
        marginRight: 5,
        fontSize: Math.max(10, width * 0.009),
    },
    darkSendedByText: {},
    lightSendedByText: {},

    avatar: {
        width: 30,
        height: 30,
        borderRadius: 25,
    },

    data: {
        flex: 1,
        flexShrink: 1,
    },

    messages: {
        padding: 10,
        marginVertical: 4,
        borderRadius: 8,
        maxWidth: '80%',
    },
    myMessgae: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084FF',
    },
    othersMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#4f5052',
    },
    myAvatar: {

    },
    othersAvatar: {

    },
    nickname: {
        fontSize: 10,
        color: '#dcdde0',
        marginBottom: 2,
    },
    text: {
        fontSize: 15,
        color: '#f3efef',
    },
    time: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    createMessageBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    typePlace: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ada8a8',
    },
    typeText: {
        color: '#dcdde0',
        fontSize: 14,
        marginLeft: 10,
    },
    emojiButtonPlace: {
        padding: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonPlace: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatName: {
        alignSelf: 'center',
        textAlign: 'center',
        marginLeft: 10,
        marginTop: 5,
        color: '#fffdfd',
        fontSize: 15,
        flex: 1,
    },
    more: {
        alignSelf: 'center',
        width: 20,
        height: 20,
    },
    chatIcon: {
        alignSelf: 'center',
        width: 20,
        height: 20,
    },
});

export default styles;