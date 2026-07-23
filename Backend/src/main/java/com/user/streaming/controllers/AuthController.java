package com.user.streaming.controllers;


import com.user.streaming.dto.RegisterRequestDTO;
import com.user.streaming.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> Register(@RequestParam String username,
                                           @RequestParam String email,
                                           @RequestParam String password)
    {
        try {
            RegisterRequestDTO dto = new RegisterRequestDTO(username, email, password);

            String message = authService.register(dto);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
