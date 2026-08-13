package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findUserByUsername(String username);
    boolean existsByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    Optional<List<User>> findByUsernameContainingIgnoreCase(String username);
}
