import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { getToken } from "./storage";

const getBrokerURL = () => {
    return Platform.OS === 'web'
        ? 'ws://localhost:9999/ms-native'
        : 'ws://192.168.1.108:9999/ms-native';
};

export function useChatSocket(chatId: string) {
    const [messages, setMessages] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!chatId) return;

        setMessages([]);

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
                    console.log(`Connected to chat ${chatId} via WebSocket!`);
                    setIsConnected(true);

                    client.subscribe(`/topic/chat/${chatId}`, (message) => {
                        const payload = JSON.parse(message.body);

                        if (payload.eventType === 'DELETE') {
                            const deletedId = payload.messageId || payload.id;
                            setMessages((prev) => prev.filter((m) => String(m.id) !== String(deletedId)));
                        } else {
                            const incomingId = payload.id || payload.messageId;

                            setMessages((prev) => {
                                const current = Array.isArray(prev) ? prev : [];

                                const exists = current.some((m) => {
                                    const existingId = m.id || m.messageId;
                                    return String(existingId) === String(incomingId);
                                });

                                if (exists) return current;

                                const normalizedSocketMessage = {
                                    ...payload,
                                    id: incomingId,
                                };

                                return [normalizedSocketMessage, ...current];
                            });
                        }
                    });
                },
                onDisconnect: () => {
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

    return { messages, setMessages, isConnected };
}