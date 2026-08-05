package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.repository.UserRepository;
import io.everyonecodes.pbltest.service.MessageService;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> sendMessage(
            @RequestBody MessageDto messageDto,
            Authentication authentication) {

        messageService.sendMessage(messageDto.chatId(), authentication.getName(), messageDto.text());

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
}
