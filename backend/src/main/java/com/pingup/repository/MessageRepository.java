package com.pingup.repository;

import com.pingup.entity.Message;
import com.pingup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("select m from Message m where " +
            "(m.sender = :a and m.receiver = :b) or (m.sender = :b and m.receiver = :a) " +
            "order by m.createdAt asc")
    List<Message> findConversation(@Param("a") User a, @Param("b") User b);

    @Query("select m from Message m where m.sender = :user or m.receiver = :user order by m.createdAt desc")
    List<Message> findRecentForUser(@Param("user") User user);
}
