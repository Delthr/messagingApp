package io.everyonecodes.pbltest.kafka;

import io.everyonecodes.pbltest.dto.ChatMessageDto;
import io.everyonecodes.pbltest.dto.MessageEventDto;
import io.everyonecodes.pbltest.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumer {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "chat-messages", groupId = "messenger-group")
    public void consume(ChatMessageDto chatMessageDto) {
        messageService.saveIncomingMessage(chatMessageDto);

        String destination = "/topic/chat/" + chatMessageDto.chatId();
        messagingTemplate.convertAndSend(destination, chatMessageDto);
    }

    @KafkaListener(topics = "deleted-message", groupId = "messenger-group")
    public void delete(MessageEventDto messageEventDto){
        String destination = "/topic/chat/" + messageEventDto.chatId();
        messagingTemplate.convertAndSend(destination, messageEventDto);
    }
}