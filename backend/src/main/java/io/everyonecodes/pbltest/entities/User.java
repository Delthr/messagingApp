package io.everyonecodes.pbltest.entities;

import io.everyonecodes.pbltest.entities.authority.Authority;
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
    private String publicKey;
    private Integer activationKey;

    public User(String password, String email, String username, Integer activationKey) {
        this.password = password;
        this.email = email;
        this.username = username;
        this.activationKey = activationKey;
    }

    @ToString.Exclude
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Authority> authorities;

}
