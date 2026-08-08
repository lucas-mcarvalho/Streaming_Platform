package com.user.streaming.service;

import com.user.streaming.dto.UserDTO;
import com.user.streaming.models.Role;
import com.user.streaming.models.User;
import com.user.streaming.repository.RoleRepository;
import com.user.streaming.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public User create(UserDTO dto){
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        Role userRole = roleRepository.findByAuthority("ROLE_USER");
        user.getRoles().add(String.valueOf(userRole));
        return userRepository.save(user);
    }


}
