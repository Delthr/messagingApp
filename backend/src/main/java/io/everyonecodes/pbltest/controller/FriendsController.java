package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.model.CustomUserDetails;
import io.everyonecodes.pbltest.service.FriendshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/api/friends")
public class FriendsController {
    private final FriendshipService friendshipService;

    public FriendsController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @GetMapping("/friendsList")
    public ResponseEntity<?> getFriendsList(Authentication authentication){
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<UserDto> resultTest = List.of(
                new UserDto(UUID.randomUUID(), "adam", "a@gmail.com"),
                new UserDto(UUID.randomUUID(), "Nidal", "ndl@gmail.com"),
                new UserDto(UUID.randomUUID(), "MJ", "mj@gmail.com"),
                new UserDto(UUID.randomUUID(), "Bernard", "br@gmail.com"),
                new UserDto(UUID.randomUUID(), "Jola", "jl@gmail.com"),
                new UserDto(UUID.randomUUID(), "MOMO", "momo@gmail.com")

        );
        List<UserDto> friends = friendshipService.getFriendsList(userDetails.getUser().getId());
        return ResponseEntity.ok(resultTest);
    }
}
