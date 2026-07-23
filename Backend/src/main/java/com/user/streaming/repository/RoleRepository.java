package com.user.streaming.repository;

import com.user.streaming.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Long> {

    Role findByAuthority(String authority);
}
