package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.model.Chat;
import io.everyonecodes.pbltest.model.ChatParticipant;
import io.everyonecodes.pbltest.model.ChatParticipantId;
import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.ChatParticipantRepository;
import org.springframework.stereotype.Service;

@Service
public class ChatParticipantService {

    private final ChatParticipantRepository chatParticipantRepository;

    public ChatParticipantService(ChatParticipantRepository chatParticipantRepository) {
        this.chatParticipantRepository = chatParticipantRepository;
    }

    public ChatParticipant createParticipant(User user, Chat chat){
        ChatParticipant chatParticipant = new ChatParticipant(new ChatParticipantId(user.getId(), chat.getId()), user, chat);
        chatParticipantRepository.save(chatParticipant);
        return chatParticipant;
    }
}
