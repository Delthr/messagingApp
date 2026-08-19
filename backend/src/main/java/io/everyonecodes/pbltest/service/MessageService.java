package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.controller.ChatMessageDto;
import io.everyonecodes.pbltest.controller.MessageEventDto;
import io.everyonecodes.pbltest.model.Chat;
import io.everyonecodes.pbltest.model.Message;
import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.ChatRepository;
import io.everyonecodes.pbltest.repository.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserService userService;
    private final ChatRepository chatRepository;
    private final KafkaProducer kafkaProducer;


    public void sendMessage(UUID chatId, String senderName, String text) {
        var loggedInUser = userService.validateUserByUsername(senderName);
        var chat = chatRepository.findById(chatId).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("Chat not found!")
        );
        ChatMessageDto chatMessageDto = new ChatMessageDto(
                UUID.randomUUID(),
                chatId,
                loggedInUser.getId(),
                loggedInUser.getUsername(),
                text,
                LocalDateTime.now().toString(),
                "SENT"
        );
        boolean isParticipant = chat.getParticipants().stream()
                .anyMatch(p -> p.getId()
                        .getUserId()
                        .equals(loggedInUser.getId()));
        if (isParticipant) {
            kafkaProducer.sendMessage(chatMessageDto, loggedInUser);
        }else {
            throw new org.springframework.security.access.AccessDeniedException("Can't acces that chat!");
        }
    }

    public Slice<ChatMessageDto> getChatHistory(UUID chatId, int page, String loggedInUsername) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(() -> new RuntimeException("Chat not found!"));
        var loggedInUser = userService.findUserByUsername(loggedInUsername).orElseThrow(
                () -> new RuntimeException("User not found!")
        );
        boolean isParticipant = chat.getParticipants().stream()
                .anyMatch(u -> u.getId().getUserId().equals(loggedInUser.getId()));
        if (!isParticipant) {
            throw new org.springframework.security.access.AccessDeniedException("You don't have access to this chat!");
        }
        var result = messageRepository.findMessageByChatId(
                chatId,
                PageRequest.of(page, 20, Sort.by("createdAt").descending())
        );
        return result.map(e -> new ChatMessageDto(
                e.getId(),
                chat.getId(),
                e.getSender().getId(),
                e.getSender().getUsername(),
                e.getText(),
                e.getCreatedAt().toString(),
                e.getStatus()
        ));
    }

    public void saveIncomingMessage(ChatMessageDto chatMessageDto) {
        Chat chat = chatRepository.findById(chatMessageDto.chatId()).orElseThrow(() -> new RuntimeException("Chat not found!"));
        User sender = userService.validateUserByUsername(chatMessageDto.senderUsername());

        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setCreatedAt(LocalDateTime.parse(chatMessageDto.time()));
        message.setText(chatMessageDto.text());
        message.setStatus("Delivered");

        messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(UUID chatId, UUID messageId, String loggedInUsername){
        var loggedInUser = userService.validateUserByUsername(loggedInUsername);
        var message = messageRepository.findById(messageId).orElseThrow(
                ()-> new jakarta.persistence.EntityNotFoundException("Message not found!")
        );
        var isMessagePartOfChat = message.getChat().getId().equals(chatId);
        var isUserAnAuthorOfMessage = message.getSender().getId().equals(loggedInUser.getId());
        if (isUserAnAuthorOfMessage && isMessagePartOfChat){
            messageRepository.delete(message);
        } else if (isMessagePartOfChat) {
            throw new org.springframework.security.access.AccessDeniedException("User is not an author of the message!");
        } else if (isUserAnAuthorOfMessage) {
            throw new IllegalArgumentException("Message is not a part of the chat!");
        } else {
            throw new IllegalArgumentException("Message is not a part of the chat and User is not an author!");
        }
        MessageEventDto messageEventDto = new MessageEventDto(chatId, messageId, loggedInUsername);
        kafkaProducer.sendDeleteEvent(messageEventDto);
    }
}
