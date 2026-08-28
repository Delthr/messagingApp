import { bytesToUtf8, utf8ToBytes } from '@noble/ciphers/utils.js';

import { gcm } from '@noble/ciphers/webcrypto.js';

import { x25519 } from '@noble/curves/ed25519.js';

import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

import api from '../utils/axioss';



const PRIVATE_KEY_STORAGE_KEY = 'e2ee_private_key';



export const bytesToHex = (bytes: Uint8Array): string =>

    Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');



export const hexToBytes = (hex: string): Uint8Array => {

    if (!hex) return new Uint8Array(0);

    const cleanHex = hex.trim();

    const bytes = new Uint8Array(cleanHex.length / 2);

    for (let i = 0; i < cleanHex.length; i += 2) {

        bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);

    }

    return bytes;

};



async function savePrivateKeyLocaly(privateKeyHex: string): Promise<void> {

    if (Platform.OS === 'web') {

        localStorage.setItem(PRIVATE_KEY_STORAGE_KEY, privateKeyHex);

    } else {

        await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, privateKeyHex);

    }

}



export async function getPrivateKeyLocaly(): Promise<string | null> {

    if (Platform.OS === 'web') {

        return localStorage.getItem(PRIVATE_KEY_STORAGE_KEY);

    } else {

        return await SecureStore.getItemAsync(PRIVATE_KEY_STORAGE_KEY);

    }

}



export async function initializeUserKeys(apiSendPublicKey?: (pubKey: string) => Promise<void>): Promise<string> {

    let privateKeyHex = await getPrivateKeyLocaly();



    if (!privateKeyHex) {

        console.log("[E2EE] No local key found. Generating a new pair...");

        const privateKeyBytes = crypto.getRandomValues(new Uint8Array(32));

        privateKeyHex = bytesToHex(privateKeyBytes);

        await savePrivateKeyLocaly(privateKeyHex);

    } else {

        console.log("[E2EE] Local private key found.");

    }





    const privateKeyBytes = hexToBytes(privateKeyHex);

    const publicKeyBytes = x25519.getPublicKey(privateKeyBytes);

    const publicKeyHex = bytesToHex(publicKeyBytes);





    try {

        if (apiSendPublicKey) {

            await apiSendPublicKey(publicKeyHex);

        } else {

            await api.post('/me/publicKey', { publicKey: publicKeyHex });

        }

        console.log("[E2EE] Public key successfully synced with backend!");

    } catch (error) {

        console.error("[E2EE] Error syncing public key with backend:", error);

    }



    return privateKeyHex;

}



export async function encryptMessgae(text: string, keyHex: string) {

    const keyBytes = hexToBytes(keyHex);

    const ivBytes = crypto.getRandomValues(new Uint8Array(12));



    const aes = gcm(keyBytes, ivBytes);

    const encryptedBytes = await aes.encrypt(utf8ToBytes(text));



    return { encryptedText: bytesToHex(encryptedBytes), iv: bytesToHex(ivBytes) };

}



export async function decryptMessage(encryptedHex: string, ivHex: string, keyHex: string): Promise<string | null> {

    try {

        const keyBytes = hexToBytes(keyHex);

        const ivBytes = hexToBytes(ivHex);

        const encryptedBytes = hexToBytes(encryptedHex);



        const aes = gcm(keyBytes, ivBytes);

        const decryptedBytes = await aes.decrypt(encryptedBytes);

        return bytesToUtf8(decryptedBytes);

    } catch (error) {

        return null;

    }

}



export async function encryptParticipantKey(messageKeyHex: string, recipientPublicKeyHex: string) {

    const ephemeralPrivateKey = crypto.getRandomValues(new Uint8Array(32));

    const ephemeralPublicKey = x25519.getPublicKey(ephemeralPrivateKey);



    const sharedSecret = x25519.getSharedSecret(ephemeralPrivateKey, hexToBytes(recipientPublicKeyHex));

    const { encryptedText, iv } = await encryptMessgae(messageKeyHex, bytesToHex(sharedSecret));

    return `${bytesToHex(ephemeralPublicKey)}:${iv}:${encryptedText}`;

}



export async function decryptParticipantKey(encryptedKeyPacket: string, myPrivateKeyHex: string): Promise<string | null> {

    const parts = encryptedKeyPacket.split(':');

    if (parts.length !== 3) return null;



    const [ephemeralPublicKey, ivHex, encryptedKeyHex] = parts;



    try {

        const sharedSecret = x25519.getSharedSecret(hexToBytes(myPrivateKeyHex), hexToBytes(ephemeralPublicKey));

        return await decryptMessage(encryptedKeyHex, ivHex, bytesToHex(sharedSecret));

    } catch (e) {

        return null;

    }

}



export async function decryptIncomingMessage(

    msg: { text: string; iv: string; encryptedKeys: Record<string, string> },

    myUserId: string,

    myPrivateKeyHex: string,

): Promise<string> {

    if (!msg || !msg.encryptedKeys) {

        return msg?.text || '';

    }



    const normalizedMyUserId = String(myUserId).toLowerCase().trim();

    const matchingKeyEntry = Object.entries(msg.encryptedKeys).find(

        ([userIdKey]) => String(userIdKey).toLowerCase().trim() === normalizedMyUserId

    );



    if (!matchingKeyEntry) {

        return '[E2EE] Missing key packet for your account';

    }



    const myEncryptedKeyPacket = matchingKeyEntry[1];

    const messageKeyHex = await decryptParticipantKey(myEncryptedKeyPacket, myPrivateKeyHex);



    if (!messageKeyHex) {

        return '[E2EE] Key error (Keys do not match)';

    }



    const decryptedText = await decryptMessage(msg.text, msg.iv, messageKeyHex);

    return decryptedText ?? '[E2EE] Failed to decrypt message';

}



export const ensureUserHasKeys = async () => {

    await initializeUserKeys();

};