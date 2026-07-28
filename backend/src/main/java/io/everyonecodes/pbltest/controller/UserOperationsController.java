package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.service.JwtService;
import io.everyonecodes.pbltest.service.UserService;
import org.apache.kafka.common.security.auth.Login;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserOperationsController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager  authenticationManager;
    private final JwtService jwtService;

    public UserOperationsController(UserService userService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginDto loginDto){
        System.out.println(loginDto);
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.username(), loginDto.password())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponseDto(token));
        } catch (BadCredentialsException e){
            return ResponseEntity.status(401).body("Wrong login or password!");
        }
    }


    @PostMapping("/register")
    public ResponseEntity<String> signUpPost(@RequestBody UserTypeRegistrationDto userTypeRegistration){
        System.out.println("Registration has been used dto: " + userTypeRegistration.toString());
        if (userService.isUserExisting(userTypeRegistration.username(), userTypeRegistration.email())){
            return ResponseEntity.badRequest().body("Email is already in use!");
        }
        var newUser = new User(
                passwordEncoder.encode(userTypeRegistration.password()),
                userTypeRegistration.email(),
                userTypeRegistration.username()
        );

        userService.saveUser(newUser);
        return ResponseEntity.status(201).body("User has been created!");
    }
}
