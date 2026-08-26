package io.everyonecodes.pbltest.dto;

import java.util.UUID;

public record FriendshipDto(UUID id, String username, String email, UUID friendshipId) {
}
