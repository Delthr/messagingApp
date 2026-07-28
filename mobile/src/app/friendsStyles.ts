import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    friendBox: {
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row',
    },
    friendData: {
        alignSelf: 'center',
        marginRight: 20,
    },
    friendDataText: {

    },
    avatar: {
        margin: 5,
        width: 30,
        height: 30,
        borderRadius: 25,
    },


    // 
    content: {
        alignItems: 'center',
    },

    // 
    row: {
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
});

export default styles;