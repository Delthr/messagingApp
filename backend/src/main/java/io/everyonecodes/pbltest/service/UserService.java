package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService  {

    private final UserRepository userRepository;

    public Optional<User> findUserById(UUID id){
        return userRepository.findById(id);
    }

    public Optional<User> findUserByUsername(String username){
        return userRepository.findUserByUsername(username);
    }
//    TODO: Maybe add findAllActiveUsers()

    public boolean isUserExisting(String username, String email){
        return userRepository.existsByUsernameOrEmail(username, email);
    }

    public void saveUser(User user){
        userRepository.save(user);
    }

    public User validateUser(String username){
        return userRepository.findUserByUsername(username).orElseThrow(()-> new jakarta.persistence.EntityNotFoundException("User not found!"));
    }
}
