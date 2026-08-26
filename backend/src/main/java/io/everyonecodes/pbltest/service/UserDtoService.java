package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.dto.UserDto;
import io.everyonecodes.pbltest.entities.User;
import org.springframework.stereotype.Service;

@Service
public class UserDtoService {
    public UserDto userToUserDtoConverter(User user){
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }
}
