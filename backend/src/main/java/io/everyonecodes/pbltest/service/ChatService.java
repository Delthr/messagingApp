package io.everyonecodes.pbltest.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.everyonecodes.pbltest.dto.ChatDto;
import io.everyonecodes.pbltest.dto.ChatUserDto;
import io.everyonecodes.pbltest.dto.UserDto;
import io.everyonecodes.pbltest.entities.Chat;
import io.everyonecodes.pbltest.entities.ChatParticipant;
import io.everyonecodes.pbltest.entities.Message;
import io.everyonecodes.pbltest.entities.User;
import io.everyonecodes.pbltest.repository.ChatParticipantRepository;
import io.everyonecodes.pbltest.repository.ChatRepository;
import io.everyonecodes.pbltest.repository.MessageRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserService userService;
    private final ChatParticipantService chatParticipantService;
    private final FriendshipService friendshipService;
    private final ChatParticipantRepository chatParticipantRepository;
    private final MessageRepository messageRepository; // <-- DODANE
    private final ObjectMapper objectMapper;

    public ChatService(ChatRepository chatRepository, UserService userService, ChatParticipantService chatParticipantService, FriendshipService friendshipService, ChatParticipantRepository chatParticipantRepository, MessageRepository messageRepository, ObjectMapper objectMapper) {
        this.chatRepository = chatRepository;
        this.userService = userService;
        this.chatParticipantService = chatParticipantService;
        this.friendshipService = friendshipService;
        this.chatParticipantRepository = chatParticipantRepository;
        this.messageRepository = messageRepository;
        this.objectMapper = objectMapper;
    }

    public Chat validateChatById(UUID chatId) {
        return chatRepository.findById(chatId).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Chat has not been found!"));
    }

    @Transactional
    public Chat createPrivateChat(String usernameA, String usernameB) {
        if (usernameA.equals(usernameB)) {
            throw new IllegalArgumentException("You cannot create a chat with yourself!");
        }

        User userA = userService.validateUserByUsername(usernameA);
        User userB = userService.validateUserByUsername(usernameB);

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
        var chat = validateChatById(chatId);
        var senderUser = userService.validateUserByUsername(senderUsername);
        boolean isParticipant = chat.getParticipants().stream()
                .anyMatch(p -> p.getId()
                        .getUserId()
                        .equals(senderUser.getId()));
        if (!isParticipant) {
            throw new jakarta.persistence.EntityNotFoundException("You are not friends with " + receiverUsername + ". Before sending a request, add friend!");
        }
        var user = userService.validateUserByUsername(receiverUsername);
        var userDto = new UserDto(user.getId(), user.getUsername(), user.getEmail());
        if (friendshipService.getFriendsList(senderUser.getId()).contains(userDto)) {
            ChatParticipant newMember = chatParticipantService.createParticipant(user, chat);
            chat.getParticipants().add(newMember);
            chatRepository.save(chat);
        }
    }


    @Transactional(readOnly = true)
    public List<ChatDto> getUserChats(String username) {
        var user = userService.validateUserByUsername(username);
        return chatRepository.findAllUserChatsWithLastMessage(user.getId());
    }
    
    @Transactional
    public void changeChatName(String newChatName, String chatId, String username) {
        var chat = getChatWithUserValidation(chatId, username);
        chat.setName(newChatName);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllChatUsers(String chatId, String username) {
        var chat = getChatWithUserValidation(chatId, username);
        return chat.getParticipants().stream()
                .map(chp -> new UserDto(chp.getUser().getId(), chp.getUser().getUsername(), chp.getUser().getEmail())).toList();
    }

    @Transactional
    public void deleteChat(String chatId, String username){
        var chat = getChatWithUserValidation(chatId, username);
        chatRepository.delete(chat);
    }

    @Transactional
    public void deleteUserFromChat(String username, String chatId, String usernameToBeDeleted){
    var chat = getChatWithUserValidation(chatId, username);
    var userToBeDeleted = userService.validateUserByUsername(usernameToBeDeleted);
    var removed = chat.getParticipants()
            .removeIf(chp -> chp.getUser().equals(userToBeDeleted));
    if (!removed){
        throw new jakarta.persistence.EntityNotFoundException("User is not in chat!");
    }
    }

    @Transactional(readOnly = true)
    public List<ChatUserDto> getChatParticipants(String chatId, String username){
        var user = userService.validateUserByUsername(username);
        var chat = validateChatById(UUID.fromString(chatId));
        var isUserPartOfChat = chat.getParticipants().stream()
                .anyMatch(chp -> chp.getUser().getId().equals(user.getId()));
        if (!isUserPartOfChat){
            throw new org.springframework.security.access.AccessDeniedException("You don't have access to that chat!");
        }

            return chat.getParticipants().stream()
                    .map(ChatParticipant::getUser)
                    .map(u -> new ChatUserDto(u.getId().toString(), u.getUsername(), u.getPublicKey()))
                    .toList();
    }

    private Chat getChatWithUserValidation(String chatId, String username) {
        var user = userService.validateUserByUsername(username);
        var chat = validateChatById(UUID.fromString(chatId));
        var isUserPartOfChat = userIsPartOfChat(user, UUID.fromString(chatId));
        if (!isUserPartOfChat) {
            throw new org.springframework.security.access.AccessDeniedException("You don't have permission!");
        }
        return chat;
    }

    public boolean userIsPartOfChat(User user, UUID chatId) {
        return chatRepository.findById(chatId).orElseThrow(
                        () -> new jakarta.persistence.EntityNotFoundException("Chat not found!"))
                .getParticipants().stream().anyMatch(ch -> ch.getUser().equals(user));
    }
}
