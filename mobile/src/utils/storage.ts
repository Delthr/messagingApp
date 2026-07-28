import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStorage from 'expo-secure-store';
import { Platform } from "react-native";

export const saveToken = async (token: string) => {
    if (Platform.OS === 'web') {
        await AsyncStorage.setItem('userToken', token);
    } else {
        await SecureStorage.setItemAsync('userToken', token);
    }
};

export const getToken = async () => {
    if (Platform.OS === 'web') {
        return await AsyncStorage.getItem('userToken');
    } else {
        return await SecureStorage.getItemAsync('userToken');
    };
};

export const removeToken = async () => {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('userToken');
    } else {
        await SecureStorage.deleteItemAsync('userToken');
    }
};