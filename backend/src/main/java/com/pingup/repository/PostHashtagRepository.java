package com.pingup.repository;

import com.pingup.entity.Post;
import com.pingup.entity.PostHashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostHashtagRepository extends JpaRepository<PostHashtag, Long> {
    List<PostHashtag> findByPost(Post post);
    void deleteByPost(Post post);
}
