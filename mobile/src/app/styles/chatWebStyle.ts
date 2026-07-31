import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    table: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
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
        borderColor: '#fff',
        borderRadius: 20,
        borderWidth: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 5,
        marginBottom: 8,
    },
    contactText: {
        marginLeft: 5,
        marginRight: 5,
        fontSize: Math.max(14, width * 0.012),
    },
    darkContactText: {},
    lightContactText: {},

    sendedByText: {
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


    // messages
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
        backgroundColor: '#E4E6EB',
    },
    myAvatar: {

    },
    othersAvatar: {

    },
    nickname: {
        fontSize: 10,
        color: '#65676B',
        marginBottom: 2,
    },
    text: {
        fontSize: 15,
        color: '#000',
    },
    time: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    createMessageBar: {
        width: '100%',
        flexDirection: 'row',
    },
    typePlace: {
        width: '90%',
        borderRadius: 20,
        borderWidth: 2,
    },
    typeText: {
        fontSize: 20,
        marginLeft: 10,
    },
    sendButtonPlace: {

    },
});


export default styles;