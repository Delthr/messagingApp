package io.everyonecodes.pbltest.model;

import io.everyonecodes.pbltest.model.authority.Authority;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Entity
@ToString
@NoArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private UUID id;
    private String username;
    private String email;
    private String password;
    private boolean enabled;

    public User(String password, String email, String username) {
        this.password = password;
        this.email = email;
        this.username = username;
    }

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, orphanRemoval = false)
    private List<Authority> authorities;

}
