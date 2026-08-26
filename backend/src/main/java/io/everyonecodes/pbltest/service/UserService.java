package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.dto.UserDto;
import io.everyonecodes.pbltest.entities.User;
import io.everyonecodes.pbltest.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    public Optional<User> findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public List<UserDto> findUserBySubString(String username) {
        return userRepository.findByUsernameContainingIgnoreCase(username).orElseGet(Collections::emptyList).stream()
                .map(e -> new UserDto(e.getId(), e.getUsername(), e.getEmail()))
                .toList();
    }

    public boolean isUserExisting(String username, String email) {
        return userRepository.existsByUsernameOrEmail(username, email);
    }

    public void saveUser(User user) {
        emailService.sendVerificationEmail(user.getEmail(), user.getActivationKey());
        userRepository.save(user);
    }

    public User validateUserByUsername(String username) {
        return userRepository.findUserByUsername(username).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found!"));
    }
    public User validateUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("User not found!"));
    }

    public String getPublicKey(String username){
        return validateUserByUsername(username).getPublicKey();
    }

    @Transactional
    public void setPublicKey(String username, String publicKey){
         validateUserByUsername(username).setPublicKey(publicKey);
    }

    @Transactional
    public String verifyUser(String username, String code){
        var user = validateUserByUsername(username);
        try{
            Integer.parseInt(code);
        }catch (Exception e){
            return "Invalid code!";
        }
        if (user.getActivationKey() == Integer.parseInt(code)){
            user.setEnabled(true);
            return "Verification ended successfully!";
        }
        return "Invalid code!";
    }
    @Transactional
    public void resendNewKey(String username){
        var user = validateUserByUsername(username);
        Random random = new Random();
        user.setActivationKey(Integer.parseInt(String.format("%04d", random.nextInt(10000))));
        emailService.sendVerificationEmail(user.getEmail(), user.getActivationKey());
    }
}
