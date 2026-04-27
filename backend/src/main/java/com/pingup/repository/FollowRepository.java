package com.pingup.repository;

import com.pingup.entity.Follow;
import com.pingup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    boolean existsByFollowerAndFollowing(User follower, User following);
    long countByFollowingAndStatus(User following, String status);
    long countByFollowerAndStatus(User follower, String status);
    List<Follow> findByFollowingAndStatus(User following, String status);
    List<Follow> findByFollowerAndStatus(User follower, String status);
}
