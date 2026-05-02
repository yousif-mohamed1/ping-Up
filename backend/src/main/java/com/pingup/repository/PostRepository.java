package com.pingup.repository;

import com.pingup.entity.Post;
import com.pingup.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserOrderByCreatedAtDesc(User user);
    long countByCreatedAtAfter(Instant since);

    @Query("SELECT p, COUNT(pl) as cnt FROM Post p LEFT JOIN PostLike pl ON pl.post = p " +
           "WHERE p.createdAt > :since GROUP BY p ORDER BY cnt DESC")
    List<Object[]> findTopByLikes(@Param("since") Instant since, Pageable pageable);
}
