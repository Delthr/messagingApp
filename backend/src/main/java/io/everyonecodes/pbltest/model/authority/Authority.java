package io.everyonecodes.pbltest.model.authority;

import io.everyonecodes.pbltest.model.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class Authority {
    @Id
    @GeneratedValue
    private UUID id;

    private AuthorityType authorityType;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
