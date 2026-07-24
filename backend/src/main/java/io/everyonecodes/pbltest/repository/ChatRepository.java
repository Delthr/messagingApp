package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    @Query("SELECT c FROM Chat c JOIN c.participants p WHERE p.id.userId = :userId")
    List<Chat> findAllChatsByUserId(@Param("userId") UUID userId);
}
