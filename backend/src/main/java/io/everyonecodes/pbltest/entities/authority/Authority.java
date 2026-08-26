package io.everyonecodes.pbltest.entities.authority;

import io.everyonecodes.pbltest.entities.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.UUID;

@Entity
@Data
public class Authority {
    @Id
    @GeneratedValue
    private UUID id;

    private AuthorityType authorityType;
    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "user_id")
    private User user;
}
