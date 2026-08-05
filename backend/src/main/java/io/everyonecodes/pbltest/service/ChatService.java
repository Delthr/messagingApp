package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.controller.ChatDto;
import io.everyonecodes.pbltest.controller.UserDto;
import io.everyonecodes.pbltest.model.*;
import io.everyonecodes.pbltest.repository.ChatRepository;
import io.everyonecodes.pbltest.repository.MessageRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserService userService;
    private final ChatParticipantService chatParticipantService;
    private final FriendshipService friendshipService;
    private final MessageRepository messageRepository;

    public ChatService(ChatRepository chatRepository, UserService userService, ChatParticipantService chatParticipantService, FriendshipService friendshipService, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.userService = userService;
        this.chatParticipantService = chatParticipantService;
        this.friendshipService = friendshipService;
        this.messageRepository = messageRepository;
    }

    public Optional<Chat> findChatById(UUID chatId) {
        return chatRepository.findById(chatId);
    }

    @Transactional
    public Chat createPrivateChat(String usernameA, String usernameB) {
        if (usernameA.equals(usernameB)) {
            throw new IllegalArgumentException("You cannot create a chat with yourself!");
        }

        User userA = userService.findUserByUsername(usernameA)
                .orElseThrow(() -> new RuntimeException("User A not found"));
        User userB = userService.findUserByUsername(usernameB)
                .orElseThrow(() -> new RuntimeException("User B not found"));

        Optional<Chat> existingChat = chatRepository.findPrivateChatBetweenUsers(userA.getId(), userB.getId());
        if (existingChat.isPresent()) {
            return existingChat.get();
        }

        boolean isFriend = friendshipService.getFriendsList(userA.getId())
                .stream()
                .anyMatch(friend -> friend.id().equals(userB.getId()));

        if (!isFriend) {
            throw new jakarta.persistence.EntityNotFoundException("You're not friends!");
        }


        Chat chat = new Chat();
        chat.setGroupChat(false);
        chat.setCreatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES));
        Chat savedChat = chatRepository.save(chat);


        ChatParticipant participantA = chatParticipantService.createParticipant(userA, savedChat);
        ChatParticipant participantB = chatParticipantService.createParticipant(userB, savedChat);

        return savedChat;
    }
    @Transactional
    public void addUserToChat(UUID chatId, String receiverUsername, String senderUsername) {
        var chat = chatRepository.findById(chatId).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("Chat not found!")
        );
        var senderUser = userService.findUserByUsername(senderUsername).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("User " + senderUsername + " has not been found!")
        );
        boolean isParticipant = chat.getParticipants().stream()
                .anyMatch(p -> p.getId()
                        .getUserId()
                        .equals(senderUser.getId()));
        if (!isParticipant) {
            throw new jakarta.persistence.EntityNotFoundException("You are not friends with " + receiverUsername + ". Before sending a request, add friend!");
        }
        var user = userService.findUserByUsername(receiverUsername).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("User " + receiverUsername + " not found!")
        );
        var userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail());
        if (isParticipant && friendshipService.getFriendsList(senderUser.getId()).contains(userDto)) {
            ChatParticipant newMember = chatParticipantService.createParticipant(user, chat);
            chat.getParticipants().add(newMember);
            chatRepository.save(chat);
        }
    }

    @Transactional
    public void deleteUserFromChat(UUID chatId, String requesterUsername, String requestedUsername) {
        var chat = chatRepository.findById(chatId).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("Chat not found!")
        );
        var requesterUser = userService.findUserByUsername(requesterUsername).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("User " + requesterUsername + " has not been found!")
        );
        var requestedUser = userService.findUserByUsername(requestedUsername).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("User " + requestedUsername + " has not been found!")
        );
        boolean isRequesterParticipant = chat.getParticipants().stream()
                .anyMatch(p -> p.getId()
                        .getUserId()
                        .equals(requesterUser.getId()));
        boolean isRequestedParticipant = chat.getParticipants().stream()
                .anyMatch(p -> p.getId()
                        .getUserId()
                        .equals(requestedUser.getId()));
        var participantList = chat.getParticipants();
        participantList.removeIf(chP -> chP.getId().getUserId().equals(requestedUser.getId()));
    }

    @Transactional
    public void removeChat(UUID chatId, String requesterUsername) {
        var requesterUser = userService.findUserByUsername(requesterUsername).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("User " + requesterUsername + " has not been found!")
        );
        var chat = chatRepository.findById(chatId).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("Chat not found!")
        );
        if (chat.getParticipants().stream().anyMatch(chP -> chP.getId().getUserId().equals(requesterUser.getId()))) {
            chatRepository.delete(chat);
        }
    }

    @Transactional(readOnly = true)
    public List<ChatDto> getUserChats(String username) {
        var user = userService.findUserByUsername(username).orElseThrow(
                () -> new jakarta.persistence.EntityNotFoundException("User " + username + " has not been found!")
        );
        return chatRepository.findAllUserChatsWithLastMessage(user.getId());
    }
}
