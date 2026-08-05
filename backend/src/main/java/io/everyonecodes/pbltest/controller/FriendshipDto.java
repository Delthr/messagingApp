package io.everyonecodes.pbltest.controller;

import java.util.UUID;

public record FriendshipDto(UUID id, String username, String email, UUID friendshipId) {
}
