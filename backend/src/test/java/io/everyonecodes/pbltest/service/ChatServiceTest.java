package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.dto.ChatDto;
import io.everyonecodes.pbltest.dto.ChatUserDto;
import io.everyonecodes.pbltest.dto.UserDto;
import io.everyonecodes.pbltest.entities.Chat;
import io.everyonecodes.pbltest.entities.ChatParticipant;
import io.everyonecodes.pbltest.entities.ChatParticipantId;
import io.everyonecodes.pbltest.entities.User;
import io.everyonecodes.pbltest.repository.ChatRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRepository chatRepository;

    @Mock
    private UserService userService;

    @Mock
    private ChatParticipantService chatParticipantService;

    @Mock
    private FriendshipService friendshipService;

    @InjectMocks
    private ChatService chatService;

    private User userA;
    private User userB;
    private User userC;
    private Chat sampleChat;
    private UUID chatId;

    @BeforeEach
    void setUp() {
        chatId = UUID.randomUUID();

        userA = new User();
        userA.setId(UUID.randomUUID());
        userA.setUsername("userA");
        userA.setEmail("usera@test.com");
        userA.setPublicKey("pubkeyA");

        userB = new User();
        userB.setId(UUID.randomUUID());
        userB.setUsername("userB");
        userB.setEmail("userb@test.com");
        userB.setPublicKey("pubkeyB");

        userC = new User();
        userC.setId(UUID.randomUUID());
        userC.setUsername("userC");
        userC.setEmail("userc@test.com");

        sampleChat = new Chat();
        sampleChat.setId(chatId);
        sampleChat.setParticipants(new ArrayList<>());
    }

    private ChatParticipant createParticipantMock(User user, Chat chat) {
        ChatParticipantId key = new ChatParticipantId();
        key.setUserId(user.getId());
        key.setChatId(chat.getId());

        ChatParticipant participant = new ChatParticipant();
        participant.setId(key);
        participant.setUser(user);
        participant.setChat(chat);
        return participant;
    }

    @Nested
    @DisplayName("Tests for validateChatById")
    class ValidateChatByIdTests {

        @Test
        @DisplayName("Should return Chat when present in repository")
        void validateChatById_Success() {
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            Chat result = chatService.validateChatById(chatId);

            assertThat(result).isNotNull().isEqualTo(sampleChat);
        }

        @Test
        @DisplayName("Should throw EntityNotFoundException when chat does not exist")
        void validateChatById_NotFound() {
            when(chatRepository.findById(chatId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> chatService.validateChatById(chatId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Chat has not been found!");
        }
    }

    @Nested
    @DisplayName("Tests for createPrivateChat")
    class CreatePrivateChatTests {

        @Test
        @DisplayName("Should throw IllegalArgumentException when trying to create chat with oneself")
        void createPrivateChat_SelfChat_ThrowsException() {
            assertThatThrownBy(() -> chatService.createPrivateChat("userA", "userA"))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("You cannot create a chat with yourself!");

            verifyNoInteractions(userService, friendshipService, chatParticipantService, chatRepository);
        }

        @Test
        @DisplayName("Should throw EntityNotFoundException when users are not friends")
        void createPrivateChat_NotFriends_ThrowsException() {
            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(userService.validateUserByUsername("userB")).thenReturn(userB);
            when(friendshipService.getFriendsList(userA.getId())).thenReturn(List.of());

            assertThatThrownBy(() -> chatService.createPrivateChat("userA", "userB"))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("You're not friends!");

            verify(chatRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should create private chat successfully when users are friends")
        void createPrivateChat_Success() {
            UserDto friendDto = new UserDto(userB.getId(), userB.getUsername(), userB.getEmail());

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(userService.validateUserByUsername("userB")).thenReturn(userB);
            when(friendshipService.getFriendsList(userA.getId())).thenReturn(List.of(friendDto));
            when(chatRepository.save(any(Chat.class))).thenAnswer(invocation -> invocation.getArgument(0));

            Chat createdChat = chatService.createPrivateChat("userA", "userB");

            assertThat(createdChat).isNotNull();
            assertThat(createdChat.isGroupChat()).isFalse();
            assertThat(createdChat.getCreatedAt()).isNotNull();

            verify(chatParticipantService).createParticipant(userA, createdChat);
            verify(chatParticipantService).createParticipant(userB, createdChat);
        }
    }

    @Nested
    @DisplayName("Tests for addUserToChat")
    class AddUserToChatTests {

        @Test
        @DisplayName("Should throw EntityNotFoundException if sender is not a participant in the chat")
        void addUserToChat_SenderNotParticipant_ThrowsException() {
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));
            when(userService.validateUserByUsername("userA")).thenReturn(userA);

            assertThatThrownBy(() -> chatService.addUserToChat(chatId, "userB", "userA"))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("You are not friends with userB. Before sending a request, add friend!");
        }

        @Test
        @DisplayName("Should do nothing if receiver is NOT in sender's friend list")
        void addUserToChat_ReceiverNotInFriendList_DoesNotAdd() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));
            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(userService.validateUserByUsername("userB")).thenReturn(userB);
            when(friendshipService.getFriendsList(userA.getId())).thenReturn(List.of());

            chatService.addUserToChat(chatId, "userB", "userA");

            verify(chatParticipantService, never()).createParticipant(any(), any());
            verify(chatRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should add receiver to chat when sender is participant and receiver is friend")
        void addUserToChat_Success() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            UserDto friendDto = new UserDto(userB.getId(), userB.getUsername(), userB.getEmail());
            ChatParticipant participantB = createParticipantMock(userB, sampleChat);

            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));
            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(userService.validateUserByUsername("userB")).thenReturn(userB);
            when(friendshipService.getFriendsList(userA.getId())).thenReturn(List.of(friendDto));
            when(chatParticipantService.createParticipant(userB, sampleChat)).thenReturn(participantB);

            chatService.addUserToChat(chatId, "userB", "userA");

            assertThat(sampleChat.getParticipants()).contains(participantB);
            verify(chatRepository).save(sampleChat);
        }
    }

    @Nested
    @DisplayName("Tests for getUserChats")
    class GetUserChatsTests {

        @Test
        @DisplayName("Should return list of ChatDto for existing user")
        void getUserChats_Success() {
            ChatDto mockChatDto = mock(ChatDto.class);
            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(chatRepository.findAllUserChatsWithLastMessage(userA.getId())).thenReturn(List.of(mockChatDto));

            List<ChatDto> result = chatService.getUserChats("userA");

            assertThat(result).hasSize(1).contains(mockChatDto);
        }
    }

    @Nested
    @DisplayName("Tests for changeChatName & getChatWithUserValidation")
    class ChangeChatNameTests {

        @Test
        @DisplayName("Should throw IllegalArgumentException if chatId string is not a valid UUID")
        void changeChatName_InvalidUuidFormat_ThrowsException() {
            assertThatThrownBy(() -> chatService.changeChatName("New Name", "invalid-uuid", "userA"))
                    .isInstanceOf(IllegalArgumentException.class);
        }

        @Test
        @DisplayName("Should throw AccessDeniedException when user is not part of the chat")
        void changeChatName_UserNotParticipant_ThrowsAccessDenied() {
            when(userService.validateUserByUsername("userC")).thenReturn(userC);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            assertThatThrownBy(() -> chatService.changeChatName("New Name", chatId.toString(), "userC"))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("You don't have permission!");
        }

        @Test
        @DisplayName("Should change chat name when user has permission")
        void changeChatName_Success() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            chatService.changeChatName("New Room Name", chatId.toString(), "userA");

            assertThat(sampleChat.getName()).isEqualTo("New Room Name");
        }
    }

    @Nested
    @DisplayName("Tests for getAllChatUsers & deleteChat")
    class ChatManagementTests {

        @Test
        @DisplayName("getAllChatUsers: Should return list of UserDto when user belongs to chat")
        void getAllChatUsers_Success() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            List<UserDto> users = chatService.getAllChatUsers(chatId.toString(), "userA");

            assertThat(users).hasSize(1);
            assertThat(users.get(0).username()).isEqualTo("userA");
        }

        @Test
        @DisplayName("deleteChat: Should delete chat when user belongs to chat")
        void deleteChat_Success() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            chatService.deleteChat(chatId.toString(), "userA");

            verify(chatRepository).delete(sampleChat);
        }
    }

    @Nested
    @DisplayName("Tests for deleteUserFromChat")
    class DeleteUserFromChatTests {

        @Test
        @DisplayName("Should throw EntityNotFoundException when user to be deleted is not in participants")
        void deleteUserFromChat_UserNotInChat_ThrowsException() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(userService.validateUserByUsername("userB")).thenReturn(userB);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            assertThatThrownBy(() -> chatService.deleteUserFromChat("userA", chatId.toString(), "userB"))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("User is not in chat!");
        }

        @Test
        @DisplayName("Should successfully remove user from chat participants")
        void deleteUserFromChat_Success() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            ChatParticipant participantB = createParticipantMock(userB, sampleChat);
            sampleChat.getParticipants().add(participantA);
            sampleChat.getParticipants().add(participantB);

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(userService.validateUserByUsername("userB")).thenReturn(userB);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            chatService.deleteUserFromChat("userA", chatId.toString(), "userB");

            assertThat(sampleChat.getParticipants()).hasSize(1).containsOnly(participantA);
        }
    }

    @Nested
    @DisplayName("Tests for getChatParticipants")
    class GetChatParticipantsTests {

        @Test
        @DisplayName("Should throw AccessDeniedException if caller is not in chat")
        void getChatParticipants_UserNotInChat_ThrowsAccessDenied() {
            when(userService.validateUserByUsername("userC")).thenReturn(userC);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            assertThatThrownBy(() -> chatService.getChatParticipants(chatId.toString(), "userC"))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("You don't have access to that chat!");
        }

        @Test
        @DisplayName("Should return List<ChatUserDto> when user is in chat")
        void getChatParticipants_Success() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(userService.validateUserByUsername("userA")).thenReturn(userA);
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            List<ChatUserDto> result = chatService.getChatParticipants(chatId.toString(), "userA");

            assertThat(result).hasSize(1);
            assertThat(result.get(0).username()).isEqualTo("userA");
            assertThat(result.get(0).publicKey()).isEqualTo("pubkeyA");
        }
    }

    @Nested
    @DisplayName("Tests for userIsPartOfChat")
    class UserIsPartOfChatTests {

        @Test
        @DisplayName("Should return false when user is not a participant")
        void userIsPartOfChat_False() {
            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            boolean result = chatService.userIsPartOfChat(userA, chatId);

            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("Should return true when user is a participant")
        void userIsPartOfChat_True() {
            ChatParticipant participantA = createParticipantMock(userA, sampleChat);
            sampleChat.getParticipants().add(participantA);

            when(chatRepository.findById(chatId)).thenReturn(Optional.of(sampleChat));

            boolean result = chatService.userIsPartOfChat(userA, chatId);

            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("Should throw EntityNotFoundException when chat is missing")
        void userIsPartOfChat_ChatNotFound() {
            when(chatRepository.findById(chatId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> chatService.userIsPartOfChat(userA, chatId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("Chat not found!");
        }
    }
}