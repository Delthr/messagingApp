import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    side: {
        width: '85%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 20,
    },
    activityIndicator: {
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 25,
        textAlign: 'center',
    },
    codeInput: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#fff',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    activateButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#0804fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 20,
    },
    activateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 20,
    },
    sendCodeText: {
        color: '#b4eafb',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default styles;