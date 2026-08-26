package io.everyonecodes.pbltest.dto;

import java.util.Map;
import java.util.UUID;

public record ChatMessageDto(UUID id,
                             UUID chatId,
                             UUID senderId,
                             String senderUsername,
                             String text,
                             String iv,
                             Map<UUID, String> encryptedKeys,
                             String time,
                             String status){
}
