package com.user.streaming.dto;

import org.hibernate.boot.jaxb.hbm.internal.RepresentationModeConverter;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;

import java.util.Objects;

public class AccountCredentialsDTO extends RepresentationModel<AccountCredentialsDTO> {

    private String username;
    private String email;
    private String password;

    public AccountCredentialsDTO(){

    }

    public AccountCredentialsDTO(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public AccountCredentialsDTO(Link initialLink, String username, String email, String password) {
        super(initialLink);
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public AccountCredentialsDTO(Iterable<Link> initialLinks, String username, String email, String password) {
        super(initialLinks);
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        AccountCredentialsDTO that = (AccountCredentialsDTO) o;
        return Objects.equals(username, that.username) && Objects.equals(email, that.email) && Objects.equals(password, that.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), username, email, password);
    }
}
