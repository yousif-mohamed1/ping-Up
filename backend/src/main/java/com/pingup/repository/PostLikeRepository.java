package com.pingup.repository;

import com.pingup.entity.Post;
import com.pingup.entity.PostLike;
import com.pingup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
    long countByPost(Post post);
    boolean existsByPostAndUser(Post post, User user);
    long countByCreatedAtAfter(Instant since);
}
