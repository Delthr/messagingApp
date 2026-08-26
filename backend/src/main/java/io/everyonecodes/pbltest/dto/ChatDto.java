package io.everyonecodes.pbltest.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.UUID;

public record ChatDto(
        UUID chatId,
        String chatName,
        String lastMessage,
        String status,
        String lastMessageIv,
        Map<UUID, String> encryptedKeys
) {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public ChatDto(UUID chatId, String chatName, String lastMessage, String status, String lastMessageIv, String encryptedKeysJson) {
        this(chatId, chatName, lastMessage, status, lastMessageIv, parseKeys(encryptedKeysJson));
    }

    private static Map<UUID, String> parseKeys(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<UUID, String>>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }
}