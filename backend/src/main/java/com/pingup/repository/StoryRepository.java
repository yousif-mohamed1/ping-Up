package com.pingup.repository;

import com.pingup.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByExpiresAtAfterOrderByCreatedAtDesc(Instant now);
}
