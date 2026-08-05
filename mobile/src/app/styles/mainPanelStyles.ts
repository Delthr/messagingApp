import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    table: {
        flexDirection: 'row',
        width: '100%',
        flex: 1,
    },
    subTableLeft: {
        width: '20%',
        paddingHorizontal: 8,
        alignItems: 'stretch',
    },
    subTableRight: {
        marginTop: 30,
        flex: 1,
        paddingHorizontal: 12,
        alignItems: 'stretch',
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
    darkContactBox: {},
    lightContactBox: {},

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

    friendsButton: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 5,
        borderRadius: 25,
        borderColor: '#ffffff',
        borderWidth: 2,
    },
    darkFriendsButton: {},
    lightFriendsButton: {},
    friendsButtonText: {
        marginLeft: 5,
        marginRight: 5,
    },

    friendBox: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        marginBottom: 8,
    },
    friendData: {
        alignSelf: 'center',
        marginRight: 20,
    },
    friendDataText: {
        fontSize: Math.max(12, width * 0.01),
    },
    requestBox: {
        width: '100%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderRadius: 35,
        marginBottom: 15,
    },
    requestsButtonText: {
        fontSize: Math.max(15, width * 0.02),
        textAlign: 'center',
    },

    content: {
        alignItems: 'stretch',
    },

    row: {
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
    },

    goToContactButton: {},

    searchContainer: {
        position: 'relative',
        zIndex: 1000,
        width: '100%',
        marginBottom: 10,
        padding: 0,
    },
    searchInput: {
        height: 40,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        fontSize: Math.max(12, width * 0.01),
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        marginTop: -2,
        left: 0,
        right: 0,
        maxHeight: 200,
        backgroundColor: '#1f1124',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#a79d9d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 2000,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownText: {
        color: '#fff',
        fontSize: Math.max(12, width * 0.01),
    },
    dropdownEmptyText: {
        color: '#aaa',
        padding: 12,
        textAlign: 'center',
        fontSize: Math.max(12, width * 0.01),
    },
    emptyText: {

    },
    input: {

    },
    goToChatButton: {

    },
    addChatButton: {
        margin: 40,
        alignSelf: 'flex-end',
    },
    modalOverlay: {
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
    modalTitle: {
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
    username: {
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
});

export default styles;