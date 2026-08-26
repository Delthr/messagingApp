package io.everyonecodes.pbltest.dto;

import java.util.UUID;

public record MessageEventDto(UUID chatId, UUID messageId, String userName) {
}
