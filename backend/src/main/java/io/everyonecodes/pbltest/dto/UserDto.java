package io.everyonecodes.pbltest.dto;

import java.util.UUID;

public record UserDto(UUID id, String username, String email) {
}
