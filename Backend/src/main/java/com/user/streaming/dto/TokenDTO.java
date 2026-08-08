package com.user.streaming.dto;

import java.util.Date;
import java.util.Objects;

public class TokenDTO {

    private String username;
    private String email;
    private Boolean authenticated;

    private String accesToken;
    private String refreshToken;
    private Date created;
    private Date expiration;


    public TokenDTO(){
    }

    public TokenDTO(String username, String accesToken, String refreshToken,   Boolean authenticated, Date created, Date expiration) {
        this.username = username;
        this.email = email;
        this.authenticated = authenticated;
        this.accesToken = accesToken;
        this.refreshToken = refreshToken;
        this.created = created;
        this.expiration = expiration;
    }



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAccesToken() {
        return accesToken;
    }

    public void setAccesToken(String accesToken) {
        this.accesToken = accesToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getExpiration() {
        return expiration;
    }

    public void setExpiration(Date expiration) {
        this.expiration = expiration;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TokenDTO tokenDTO = (TokenDTO) o;
        return Objects.equals(username, tokenDTO.username) && Objects.equals(email, tokenDTO.email) && Objects.equals(authenticated, tokenDTO.authenticated) && Objects.equals(accesToken, tokenDTO.accesToken) && Objects.equals(refreshToken, tokenDTO.refreshToken) && Objects.equals(created, tokenDTO.created) && Objects.equals(expiration, tokenDTO.expiration);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, email, authenticated, accesToken, refreshToken, created, expiration);
    }
}
