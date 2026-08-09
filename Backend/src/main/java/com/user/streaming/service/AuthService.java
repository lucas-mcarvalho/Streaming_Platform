package com.user.streaming.service;


import com.user.streaming.Security.Jwt.JwtTokenProvider;
import com.user.streaming.dto.AccountCredentialsDTO;
import com.user.streaming.dto.RegisterRequestDTO;
import com.user.streaming.dto.TokenDTO;
import com.user.streaming.models.Role;
import com.user.streaming.models.User;
import com.user.streaming.repository.RoleRepository;
import com.user.streaming.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private AuthenticationManager authenticationManager;


    @Autowired
    private JwtTokenProvider tokenProvider;
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


    public ResponseEntity<TokenDTO> login(AccountCredentialsDTO credentialsDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(credentialsDTO.getEmail(), credentialsDTO.getPassword())
        );
        var user = userRepository.findByEmail(credentialsDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado!"));

       /* if (!user.getName().equals(credentialsDTO.getUsername())) {
            throw new BadCredentialsException("Username ou senha inválidos!");
        }
    */
        var token = tokenProvider.createAccesToken(
                user.getEmail(),
                user.getRoles()
        );
        token.setUsername(user.getName());
        token.setEmail(user.getEmail());
        return ResponseEntity.ok(token);
    }
}
