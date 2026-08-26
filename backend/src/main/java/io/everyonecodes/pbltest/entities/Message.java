package io.everyonecodes.pbltest.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "messages")
public class Message {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(length = 64)
    private String iv;

    @Column(columnDefinition = "text")
    private String encryptedKeys;

    @Column(columnDefinition = "text")
    private String text;
    private LocalDateTime createdAt;
    private String status;
}
