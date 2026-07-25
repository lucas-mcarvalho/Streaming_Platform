package com.user.streaming.Security.Jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.udemyCourse.course.exceptions.InvalidJwtAuthenticationException;
import com.user.streaming.dto.TokenDTO;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Service
public class JwtTokenProvider {

    @Value("${security.jwt.token.secret-key:secret}")
    private String secretKey = "secret";

    @Value("${security.jwt.token.expire-length:3600000}")
    private long expireLength = 3600000;

    @Autowired
    private UserDetailsService userDetailsService;

    private Algorithm algorithm;


    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
        algorithm = Algorithm.HMAC256(secretKey.getBytes(StandardCharsets.UTF_8));
    }


    public TokenDTO refreshToken(String refreshToken) {
        if (refreshTokenContainsBearer(refreshToken)) {
            refreshToken = refreshToken.substring("Bearer".length());
        }
        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decodedJWT = verifier.verify(refreshToken);
        String username = decodedJWT.getSubject();

        List<String> roles = decodedJWT.getClaim("roles").asList(String.class);
        return createAccesToken(username, roles);

    }

    private String getRefreshToken(String username, List<String> roles, Date now) {
        Date refreshTokenValidity = new Date(now.getTime() + expireLength * 3);

        return JWT.create().withClaim("roles", roles).withIssuedAt(now).withExpiresAt(refreshTokenValidity).withSubject(username).
                sign(algorithm);
    }


    private String getAccesToken(String username, List<String> roles, Date now, Date validity) {
        String issueURL = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

        return JWT.create().withClaim("roles", roles).withIssuedAt(now).withExpiresAt(validity).withSubject(username).withIssuer(issueURL).sign(algorithm);

    }

    public Authentication getAuthentication(String token) {
        DecodedJWT decodedJWT = decodedToken(token);
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(decodedJWT.getSubject());
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    private DecodedJWT decodedToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public String resolveToken(HttpServletRequest request) {
        String BearerToken = request.getHeader("Authorization");
        if (BearerToken != null && BearerToken.startsWith("Bearer ")) {
            return BearerToken.substring("Bearer ".length());
        }
        return null;
    }

    public TokenDTO createAccesToken(String username, List<String> roles) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + expireLength);

        String accessToken = getAccesToken(username, roles, now, validity);
        String refreshToken = getRefreshToken(username, roles, now);

        return new TokenDTO(username, accessToken, refreshToken, true, now, validity);

    }

    private boolean refreshTokenContainsBearer(String refreshToken) {
        return refreshToken != null && refreshToken.startsWith("Bearer ");

    }

    public boolean validateToken(String token) {
        try {
            DecodedJWT decodedToken = decodedToken(token);
            if (decodedToken.getExpiresAt().before(new Date())) {
                return false;
            }
            return true;
        } catch (Exception e) {
            throw new InvalidJwtAuthenticationException("Expired or invalid JWT token");
        }
    }

}
