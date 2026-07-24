package io.everyonecodes.pbltest.controller;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatMessageDto(UUID chatId, UUID senderId, String content, LocalDateTime sentAt){
}
