package io.everyonecodes.pbltest.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatMessageDto(UUID id,
                             UUID chatId,
                             UUID senderId,
                             String senderUsername,
                             String text,
                             String time,
                             String status){
}
