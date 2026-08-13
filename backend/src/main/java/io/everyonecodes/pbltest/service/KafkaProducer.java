package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.controller.ChatMessageDto;
import io.everyonecodes.pbltest.controller.MessageEventDto;
import io.everyonecodes.pbltest.model.User;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {
    private final KafkaTemplate<String, ChatMessageDto> kafkaTemplate;
    private final KafkaTemplate<String, MessageEventDto> deletionTemplate;
    private final ChatService chatService;

    public KafkaProducer(KafkaTemplate<String, ChatMessageDto> kafkaTemplate, KafkaTemplate<String, MessageEventDto> deletionTemplate, ChatService chatService) {
        this.kafkaTemplate = kafkaTemplate;
        this.deletionTemplate = deletionTemplate;
        this.chatService = chatService;
    }

    public void sendMessage(ChatMessageDto chatMessageDto, User loggedInUser) {
        var chat = chatService.validateChatById(chatMessageDto.chatId());
        boolean isParticipant = chat.getParticipants().stream()
                .anyMatch(p -> p.getId()
                        .getUserId()
                        .equals(loggedInUser.getId()));
        if (isParticipant) {
            System.out.println("Sending message to kafka...");
            kafkaTemplate.send("chat-messages", chatMessageDto);
        } else {
            throw new IllegalStateException("You cant access this chat. Access denied!");
        }
    }

    public void sendDeleteEvent(MessageEventDto messageEventDto){
        deletionTemplate.send("deleted-message", messageEventDto);
    }
}
