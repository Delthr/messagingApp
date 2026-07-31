package io.everyonecodes.pbltest.controller;

import java.util.UUID;

public record AuthResponseDto(String token, UUID id) {
}
