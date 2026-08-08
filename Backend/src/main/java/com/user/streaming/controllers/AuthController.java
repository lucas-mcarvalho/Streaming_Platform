package com.user.streaming.controllers;


import com.nimbusds.oauth2.sdk.util.StringUtils;
import com.user.streaming.dto.AccountCredentialsDTO;
import com.user.streaming.dto.RegisterRequestDTO;
import com.user.streaming.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> Register(@RequestBody RegisterRequestDTO registerRequestDTO)
    {
        try {
            RegisterRequestDTO dto = new RegisterRequestDTO(registerRequestDTO.username(), registerRequestDTO.email(), registerRequestDTO.password());

            String message = authService.register(dto);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody AccountCredentialsDTO accountCredentialsDTO){
        if(credentialsIsInvalid(accountCredentialsDTO)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid client Request!");
        }
        var token = authService.login(accountCredentialsDTO);
        if(token == null) ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid client request");
        return authService.login(accountCredentialsDTO);
    }

    private static boolean credentialsIsInvalid(AccountCredentialsDTO credentialsDTO) {
        return credentialsDTO == null && StringUtils.isBlank(credentialsDTO.getPassword())
                || StringUtils.isBlank(credentialsDTO.getUsername());
    }
}
