package io.everyonecodes.pbltest.dto;

import java.util.UUID;

public record AuthResponseDto(String token, UUID id) {
}
