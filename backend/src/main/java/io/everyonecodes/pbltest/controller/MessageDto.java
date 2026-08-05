package io.everyonecodes.pbltest.controller;

import java.util.UUID;

public record MessageDto(UUID id, UUID chatId, UUID senderId, String senderUsername, String text, String LocalDateTime, String status) {
}
