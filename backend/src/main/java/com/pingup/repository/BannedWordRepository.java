package com.pingup.repository;

import com.pingup.entity.BannedWord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BannedWordRepository extends JpaRepository<BannedWord, Long> {
    Optional<BannedWord> findByWord(String word);
    boolean existsByWord(String word);
}
