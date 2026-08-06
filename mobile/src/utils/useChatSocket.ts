import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { getToken } from "./storage";

const getBrokerURL = () => {
    if (Platform.OS === 'web') {
        return 'ws://localhost:9999/ms-native';
    } else {
        return 'ws://192.168.1.108:9999/ms-native';
    }
}

export function useChatSocket(chatId: string) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isConneected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!chatId) return;

        let client: Client;

        const initSocket = async () => {
            const token = await getToken();
            if (!token) return;

            client = new Client({
                brokerURL: getBrokerURL(),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                webSocketFactory: () => new WebSocket(getBrokerURL()),
                debug: (str) => {
                    if (__DEV__) console.log('[STOMP WS]:', str);
                },
                reconnectDelay: 5000,
                onConnect: () => {
                    console.log("Connected with chat via webSocket!");
                    setIsConnected(true);

                    client.subscribe(`/topic/chat/${chatId}`, (message) => {
                        const payload = JSON.parse(message.body);

                        if (payload.eventType === 'DELETE') {
                            setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
                        } else {
                            setMessages((prev) => {
                                const exists = prev.some((m) => String(m.id) === String(payload.id));
                                if (exists) return prev;
                                return [payload, ...prev];
                            });
                        }
                    });
                },
                onDisconnect: () => {
                    console.log('Disconnected!');
                    setIsConnected(false);
                },
                onStompError: (frame) => {
                    console.error("Stomp error: ", frame.headers['message']);
                },
            });

            client.activate();
            stompClientRef.current = client;
        };

        initSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [chatId]);

    return { messages, setMessages, isConneected };
}