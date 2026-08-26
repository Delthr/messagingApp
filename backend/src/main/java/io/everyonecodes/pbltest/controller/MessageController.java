package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.dto.ChatMessageDto;
import io.everyonecodes.pbltest.dto.MessageDto;
import io.everyonecodes.pbltest.service.MessageService;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    private final ObjectMapper objectMapper;

    public MessageController(MessageService messageService, ObjectMapper objectMapper) {
        this.messageService = messageService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> sendMessage(
            @RequestBody MessageDto messageDto,
            Authentication authentication) {

        messageService.sendMessage(
                messageDto.chatId(),
                authentication.getName(),
                messageDto.text(),
                messageDto.iv(),
                messageDto.encryptedKeys()
        );

        return ResponseEntity.ok("Sent!");
    }

    @GetMapping("/{chatId}/messages")
    @PreAuthorize("isAuthenticated()")
    public Slice<ChatMessageDto> getChatHistory(
            @PathVariable UUID chatId,
            @RequestParam(defaultValue = "0") int page,
            Authentication authentication
    ) {
        return messageService.getChatHistory(chatId, page, authentication.getName());
    }

    public Map<UUID, String> parseEncryptedKeys(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(
                    json,
                    objectMapper.getTypeFactory().constructMapType(Map.class, UUID.class, String.class)
            );
        } catch (Exception e) {
            return Map.of();
        }
    }
}
