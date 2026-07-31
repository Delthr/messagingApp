package io.everyonecodes.pbltest.controller;

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

    private final UserRepository userRepository;
    private final ChatService chatService;

    public ChatController(UserRepository userRepository, ChatService chatService) {
        this.userRepository = userRepository;
        this.chatService = chatService;
    }

    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createPrivateChat(@RequestBody UserDto userDto,
                                                    Authentication authentication) {
        chatService.createPrivateChat(userDto.username(), authentication.getName());
        return ResponseEntity.ok("Chat is created!");
    }

    @PostMapping("/{chatId}/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> addNewUserToAChat(@RequestBody UserDto receiverDto,
                                                    @PathVariable UUID chatId,
                                                    Authentication authentication){
       chatService.addUserToChat(chatId, receiverDto.username(), authentication.getName());

        return  ResponseEntity.ok("User " +  receiverDto.username() + " has been invited!");
    }
    @DeleteMapping("/{chatId}/deleteUser")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteUserFromChat(@RequestBody UserDto userToDeleteDto,
                                                     @PathVariable UUID chatId,
                                                     Authentication authentication){
        chatService.deleteUserFromChat(chatId, authentication.getName(), userToDeleteDto.username());
    return ResponseEntity.ok("User " + userToDeleteDto.username() + " has been removed from chat!");
    }
    @DeleteMapping("/{chatId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> deleteChat(@PathVariable UUID chatId,
                                             Authentication authentication){
        chatService.removeChat(chatId, authentication.getName());

        return ResponseEntity.ok("Chat has been deleted!");
    }

    @GetMapping("/allChats")
    @PreAuthorize("isAuthenticated()")
    public List<ChatDto> getAllUserChats(Authentication authentication){
        return chatService.getUserChats(authentication.getName());
    }
}
