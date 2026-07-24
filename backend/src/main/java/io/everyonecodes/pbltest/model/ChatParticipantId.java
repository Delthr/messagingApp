package io.everyonecodes.pbltest.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantId implements Serializable {
    @Column(name = "user_id")
    private UUID userId;
    @Column(name = "chat_id")
    private UUID chatId;
}
