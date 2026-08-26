package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.config.security.CustomUserDetails;
import io.everyonecodes.pbltest.dto.*;
import io.everyonecodes.pbltest.entities.User;
import io.everyonecodes.pbltest.errorHandling.ErrorResponse;
import io.everyonecodes.pbltest.jwt.JwtService;
import io.everyonecodes.pbltest.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

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
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.username(), loginDto.password())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            System.out.println("ok1");
            return ResponseEntity.ok(new AuthResponseDto(token, userDetails.getUser().getId()));
    }


    @PostMapping("/register")
    public ResponseEntity<?> signUpPost(@RequestBody UserTypeRegistrationDto userTypeRegistration){
        System.out.println("Registration has been used dto: " + userTypeRegistration.toString());
        if (userService.isUserExisting(userTypeRegistration.username(), userTypeRegistration.email())){
            return ResponseEntity.badRequest().body(new ErrorResponse("Email is already in use!", 403));
        }
        Random random = new Random();

        var newUser = new User(
                passwordEncoder.encode(userTypeRegistration.password()),
                userTypeRegistration.email(),
                userTypeRegistration.username(),
                Integer.parseInt(String.format("%04d", random.nextInt(10000)))
        );

        userService.saveUser(newUser);
        return ResponseEntity.status(201).body("User has been created!");
    }

    @GetMapping("/findAUserId")
    public ResponseEntity<?> findUserId(@RequestParam String userName){
     var users = userService.findUserBySubString(userName);
    return ResponseEntity.ok(users);
    }

    @PostMapping("/me/publicKey")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String>updatePublicKey(@RequestBody Map<String, String> body,
                                               Authentication authentication){
        String publicKey = body.get("publicKey");
        userService.setPublicKey(authentication.getName(), publicKey);
        return ResponseEntity.ok("Key has been successfully updated!");
    }

    @GetMapping("/{username}/getPublicKey")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> getPublicKey(@PathVariable String username, Authentication authentication){
        String publicKey = userService.getPublicKey(username);
    return ResponseEntity.ok(Map.of("publicKey", publicKey != null ? publicKey : ""));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyRequestDto requestDto){
        var result = userService.verifyUser(requestDto.username(), requestDto.code());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify/resend")
    public ResponseEntity<String> resendVerificationCode(@RequestBody NewActivationCodeRequestDto newActivationCodeRequestDto){
        userService.resendNewKey(newActivationCodeRequestDto.username());
        return ResponseEntity.ok("Code has been resent.");
    }
}
