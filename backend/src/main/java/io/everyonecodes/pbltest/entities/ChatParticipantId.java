package io.everyonecodes.pbltest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@EqualsAndHashCode
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantId implements Serializable {
    @Column(name = "user_id")
    private UUID userId;
    @Column(name = "chat_id")
    private UUID chatId;
}
