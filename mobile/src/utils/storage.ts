import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";

export const saveToken = async (token: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem('userToken', token);
    } else {
        await SecureStore.setItemAsync('userToken', token);
    }
};

export const getToken = async () => {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem('userToken');
    } else {
        return await SecureStore.getItemAsync('userToken');
    };
};

export const removeToken = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('userToken');
    } else {
        await SecureStore.deleteItemAsync('userToken');
    }
};

export const saveUserId = async (userId: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem('userId', userId);
    } else {
        await SecureStore.setItemAsync('userId', userId);
    }
}

export const getUserId = async () => {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem('userId');
    } else {
        return await SecureStore.getItemAsync('userId');
    }
}

export const removeUserId = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('userId');
    } else {
        await SecureStore.deleteItemAsync('userId');
    }
}