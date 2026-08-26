package io.everyonecodes.pbltest.dto;

import java.util.Map;
import java.util.UUID;

public record MessageDto(
        UUID chatId,
        String text,
        String iv,
        Map<UUID, String> encryptedKeys
) {
}
