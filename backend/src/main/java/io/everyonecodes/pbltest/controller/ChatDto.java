package io.everyonecodes.pbltest.controller;

import java.util.UUID;

public record ChatDto(UUID chatId, String chatName, String lastMessage, String status) {
}
