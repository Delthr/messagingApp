package io.everyonecodes.pbltest.controller;

import java.util.UUID;

public record UserDto(UUID id, String username, String email) {
}
