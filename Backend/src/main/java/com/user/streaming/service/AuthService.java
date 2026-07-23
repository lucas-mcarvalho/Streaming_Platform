package com.user.streaming.service;


import com.user.streaming.dto.RegisterRequestDTO;
import com.user.streaming.models.Role;
import com.user.streaming.models.User;
import com.user.streaming.repository.RoleRepository;
import com.user.streaming.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {


    @Autowired
    private PasswordValidatorService passwordValidatorService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private TokenService tokenService;

    public String register(RegisterRequestDTO body) {

        Optional<User> existingUser = userRepository.findByEmail(body.email());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email já cadastrado!");
        }

        Optional<User> existingUsername = userRepository.findByName(body.username());
        if (existingUsername.isPresent()) {
            throw new RuntimeException("Este username já está em uso!");
        }

      //  passwordValidatorService.validate(body.password());


        User newUser = new User();
        newUser.setName(body.username());
        newUser.setEmail(body.email());
        newUser.setPassword(passwordEncoder.encode(body.password()));

       /* Role userRole = roleRepository.findByAuthority("ROLE_USER");

        if (userRole == null) {
            userRole = new Role(null, "ROLE_USER");
            roleRepository.save(userRole);
        }
        newUser.getRoles().add(userRole);
        */
        userRepository.save(newUser);
        return "Usuário registrado com sucesso.";
    }
}
