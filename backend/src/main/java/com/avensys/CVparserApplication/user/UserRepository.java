package com.avensys.CVparserApplication.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    User findByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.firstName ILIKE %?1%"
            + " OR u.lastName ILIKE %?1%"
            + " OR u.email ILIKE %?1%")
    List<User> findByUserByFirstNameOrLastNameOrEmail(String keyword);
}
