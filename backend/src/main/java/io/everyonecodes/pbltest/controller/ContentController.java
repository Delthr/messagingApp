package io.everyonecodes.pbltest.controller;

import io.everyonecodes.pbltest.model.User;
import io.everyonecodes.pbltest.repository.UserRepository;
import org.hibernate.boot.models.spi.UserTypeRegistration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ContentController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ContentController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/login")
    public ModelAndView login(){
        ModelAndView modelAndView = new ModelAndView("login");
        return modelAndView;
    }

    @GetMapping("/isworking")
    public ModelAndView working(){
        ModelAndView modelAndView= new ModelAndView("isworking");
        return modelAndView;
    }
}
