package io.everyonecodes.pbltest.controller;

import java.util.UUID;

public record MessageEventDto(UUID chatId, UUID messageId, String userName) {
}
