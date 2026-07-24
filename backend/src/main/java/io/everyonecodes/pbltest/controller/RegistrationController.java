package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class RegistrationController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/signup")
    public ModelAndView signUp(){
        return new ModelAndView("signup");
    }

    @PostMapping("/register")
    public ModelAndView signUpPost(@ModelAttribute UserTypeRegistrationDto userTypeRegistration){
        var newUser = new User(
                passwordEncoder.encode(userTypeRegistration.password()),
                userTypeRegistration.email(),
                userTypeRegistration.nickname()
        );

        userRepository.save(newUser);
        return new ModelAndView("login");
    }
}
