package com.user.streaming.config;

import com.user.streaming.models.Role;
import com.user.streaming.models.User;
import com.user.streaming.repository.RoleRepository;
import com.user.streaming.repository.UserRepository;
import com.user.streaming.service.TokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            Role userRole = roleRepository.findByAuthority("ROLE_USER");
            if (userRole == null) {
                userRole = new Role(null, "ROLE_USER");
                roleRepository.save(userRole);
            }
            newUser.getRoles().add(userRole);
            return userRepository.save(newUser);
        });

        String accessToken = tokenService.generateToken(user);
        String refreshToken = tokenService.createRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        String frontendUrl = "http://localhost:5173/oauth2/redirect";
        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

}
