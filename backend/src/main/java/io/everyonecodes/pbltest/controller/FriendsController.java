package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.config.security.CustomUserDetails;
import io.everyonecodes.pbltest.dto.UserDto;
import io.everyonecodes.pbltest.service.FriendshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
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
        List<UserDto> friends = friendshipService.getFriendsList(userDetails.getUser().getId());
        return ResponseEntity.ok(friends);
    }

    @PostMapping("/sendRequest")
    public ResponseEntity<String> sendRequest(@RequestBody String id, Authentication authentication){
        friendshipService.sendFriendRequest(((CustomUserDetails) Objects.requireNonNull(authentication.getPrincipal())).getUser().getId(), UUID.fromString(id));
        return ResponseEntity.ok("Request has been sent!");
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getRequests(Authentication authentication){
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(friendshipService.getRequestsList(customUserDetails.getUser().getId()));
    }

    @PostMapping("/accept")
    public ResponseEntity<String> acceptRequest(@RequestBody String friendshipId,
                                                Authentication authentication){
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        friendshipService.acceptFriendRequest(UUID.fromString(friendshipId),customUserDetails.getUser().getId());
        return ResponseEntity.ok().build();
    }
    @PostMapping("/reject")
    public ResponseEntity<String> rejectRequest(@RequestBody String friendshipId,
                                                Authentication authentication){
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        friendshipService.rejectOrRemoveFriend(UUID.fromString(friendshipId),customUserDetails.getUser().getId());
        return ResponseEntity.ok().build();
    }
    @PostMapping("/remove")
    public ResponseEntity<String> removeFriend(@RequestBody String friendsId,
                                               Authentication authentication){
        return ResponseEntity.ok("friend has been removed!");
    }
}
