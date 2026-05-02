package com.pingup.repository;

import com.pingup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    long countByCreatedAtAfter(Instant since);
    long countByBannedTrue();
    long countByMutedTrue();
    List<User> findTop30ByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCaseOrBioContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String fullName,
            String username,
            String bio,
            String location
    );
}
