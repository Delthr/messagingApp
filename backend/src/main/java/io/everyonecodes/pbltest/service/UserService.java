package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.controller.UserDto;
import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }
//    TODO: Maybe add findAllActiveUsers()

    public List<UserDto> findUserBySubString(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username).orElseGet(Collections::emptyList).stream()
                .map(e -> new UserDto(e.getId(), e.getUsername(), e.getEmail()))
                .toList();
    }

    public boolean isUserExisting(String username, String email) {
        return userRepository.existsByUsernameOrEmail(username, email);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User validateUserByUsername(String username) {
        return userRepository.findUserByUsername(username).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found!"));
    }
    public User validateUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found!"));
    }
}
