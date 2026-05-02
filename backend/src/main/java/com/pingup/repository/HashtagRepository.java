package com.pingup.repository;

import com.pingup.entity.Hashtag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByName(String name);

    @Query("SELECT h, COUNT(ph) as cnt FROM Hashtag h JOIN PostHashtag ph ON ph.hashtag = h " +
           "WHERE ph.createdAt > :since GROUP BY h ORDER BY cnt DESC")
    List<Object[]> findTrending(@Param("since") Instant since, Pageable pageable);
}
