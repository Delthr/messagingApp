import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OkModalProps {
    visible: boolean;
    okMessage: string;
    onClose: () => void;
}

export default function OkModal({ visible, okMessage, onClose }: OkModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.messageText}>{okMessage}</Text>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#1E1E2E',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#313244',
    },
    messageText: {
        fontSize: 16,
        color: '#CDD6F4',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#89B4FA',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
    },
    buttonText: {
        color: '#11111B',
        fontWeight: 'bold',
        fontSize: 16,
    },
});