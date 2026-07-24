package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.controller.UserDto;
import io.everyonecodes.pbltest.model.Friendship;
import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.FriendshipRepository;
import io.everyonecodes.pbltest.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    public void sendFriendRequest(UUID senderId, UUID receiverId) {
        if (senderId.equals(receiverId)) {
            throw new IllegalStateException("You cant send a request to yourself.");
        }
        var tempCheck = friendshipRepository.findExistingFriendship(senderId, receiverId);
        if (tempCheck.isPresent() && !tempCheck.get().getStatus().equals("REMOVED")) {
            throw new IllegalStateException("Friendship already exists! Status: " + tempCheck.get().getStatus());
        } else if (tempCheck.isPresent()) {
            var friendship = tempCheck.get();
            friendship.setInviting(userRepository.findById(senderId).orElseThrow(
                    () -> new jakarta.persistence.EntityNotFoundException("No such user exists!")
            ));
            friendship.setReceiver(userRepository.findById(receiverId).orElseThrow(
                    () -> new jakarta.persistence.EntityNotFoundException("No such user exists!")
            ));
            friendship.setStatus("PENDING");
            friendshipRepository.save(friendship);
        } else {
            Friendship friendship = new Friendship();
            friendship.setInviting(userRepository.findById(senderId).orElseThrow(
                    () -> new jakarta.persistence.EntityNotFoundException("No such user exists!")
            ));
            friendship.setReceiver(userRepository.findById(receiverId).orElseThrow(
                    () -> new jakarta.persistence.EntityNotFoundException("No such user exists!")
            ));
            friendship.setStatus("PENDING");
            friendshipRepository.save(friendship);
        }
    }

    public void acceptFriendRequest(UUID friendshipId, UUID receiverId) {
        var result = friendshipRepository.findById(friendshipId);
        if (result.isEmpty()) {
            throw new jakarta.persistence.EntityNotFoundException("Friendship don't exists!");
        }
        var temp = result.get();
        if (temp.getReceiver().getId().equals(receiverId)) {
            temp.setStatus("ACCEPTED");
            friendshipRepository.save(temp);
        } else {
            throw new IllegalStateException("You cant access this friendship. Access denied!");
        }
    }


    public void rejectOrRemoveFriend(UUID friendshipId, UUID userId) {
        var result = friendshipRepository.findById(friendshipId).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Friendship don't exists!"));
        if (result.getInviting().getId().equals(userId) || result.getReceiver().getId().equals(userId)) {
            result.setStatus("REMOVED");
            friendshipRepository.save(result);
        } else {
            throw new IllegalStateException("You cant access this friendship. Access denied!");
        }
    }

    public List<UserDto> getFriendsList(UUID userId) {
        String status = "ACCEPTED";
        var result = friendshipRepository.findAllByStatusAndInvitingIdOrStatusAndReceiverId(status, userId, status, userId);
        List<UserDto> friendListDto = new ArrayList<>();

        for (Friendship f : result) {
            if (f.getInviting().getId().equals(userId)) {
                UUID friendsId = f.getReceiver().getId();
                String friendsUsername = f.getReceiver().getUsername();
                String friendsEmail = f.getReceiver().getEmail();
                friendListDto.add(new UserDto(friendsId, friendsUsername, friendsEmail));
            } else {
                UUID friendsId = f.getInviting().getId();
                String friendsUsername = f.getInviting().getUsername();
                String friendsEmail = f.getInviting().getEmail();
                friendListDto.add(new UserDto(friendsId, friendsUsername, friendsEmail));
            }
        }
        return friendListDto;
    }
}
