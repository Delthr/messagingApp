package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.model.Chat;
import io.everyonecodes.pbltest.repository.UserRepository;
import io.everyonecodes.pbltest.service.ChatService;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {


    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }


    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Chat> createPrivateChat(@RequestBody UserDto userDto,
                                                  Authentication authentication) {
        var result = chatService.createPrivateChat(userDto.username(), authentication.getName());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> addNewUserToAChat(@RequestBody AddUserToChatDto receiverDto,
                                                    Authentication authentication){
       chatService.addUserToChat(UUID.fromString(receiverDto.chatId()), receiverDto.username(), authentication.getName());

        return  ResponseEntity.ok("User " +  receiverDto.username() + " has been invited!");
    }

    @DeleteMapping("/{chatId}/deleteChat")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteChat(@PathVariable String chatId,
                                             Authentication authentication){
        chatService.deleteChat(chatId, authentication.getName());

        return ResponseEntity.ok("Chat has been deleted!");
    }

    @GetMapping("/allChats")
    @PreAuthorize("isAuthenticated()")
    public List<ChatDto> getAllUserChats(Authentication authentication){
        return chatService.getUserChats(authentication.getName());
    }

    @PostMapping("/changeChatName")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changeChatName(@RequestBody ChangeChatNameDto changeChatNameDto, Authentication authentication){
        chatService.changeChatName(changeChatNameDto.newChatName(), changeChatNameDto.chatId(), authentication.getName());
        return ResponseEntity.ok("Name has been change!");
    }


    @GetMapping("/{chatId}/getAllChatUsers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllChatUsers(@PathVariable String chatId, Authentication authentication){
        var result = chatService.getAllChatUsers(chatId, authentication.getName());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{chatId}/deleteUserFromChat/{usernameToBeDeleted}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteUserFromAChat(@PathVariable String chatId, @PathVariable String usernameToBeDeleted, Authentication authentication){
    chatService.deleteUserFromChat(authentication.getName(), chatId, usernameToBeDeleted);
    return ResponseEntity.ok("User has been deleted!");
    }
}
