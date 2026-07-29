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


});

export default styles;