package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.config.security.CustomUserDetails;
import io.everyonecodes.pbltest.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user =  userRepository.findUserByUsername(username).orElseThrow(()-> new jakarta.persistence.EntityNotFoundException("User not found!"));
        return new CustomUserDetails(user);
    }
}
