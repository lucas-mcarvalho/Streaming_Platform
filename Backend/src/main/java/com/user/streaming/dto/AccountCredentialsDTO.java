package com.user.streaming.dto;

import java.util.Objects;

import org.springframework.hateoas.Link;
import org.springframework.hateoas.RepresentationModel;

public class AccountCredentialsDTO extends RepresentationModel<AccountCredentialsDTO> {

    private String email;
    private String password;

    public AccountCredentialsDTO(){

    }

    public AccountCredentialsDTO( String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AccountCredentialsDTO(Link initialLink, String email, String password) {
        super(initialLink);
        this.email = email;
        this.password = password;
    }

    public AccountCredentialsDTO(Iterable<Link> initialLinks, String email, String password) {
        super(initialLinks);

        this.email = email;
        this.password = password;
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
        return Objects.equals(email, that.email) && Objects.equals(password, that.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), email, password);
    }
}
