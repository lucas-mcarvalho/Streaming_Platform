package com.user.streaming.dto;

public record RegisterRequestDTO(
        String username,
        String email,
        String password) {
}
