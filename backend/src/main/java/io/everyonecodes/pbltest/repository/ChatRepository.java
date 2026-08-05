package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.controller.ChatDto;
import io.everyonecodes.pbltest.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {
    @Query("SELECT c FROM Chat c JOIN c.participants p WHERE p.id.userId = :userId")
    List<Chat> findAllChatsByUserId(@Param("userId") UUID userId);

    @Query("""
    SELECT new io.everyonecodes.pbltest.controller.ChatDto(
        c.id, 
        c.name, 
        COALESCE(m.text, ''), 
        COALESCE(m.status, 'There are no messages in this chat!')
    )
    FROM Chat c
    JOIN c.participants p
    LEFT JOIN c.messages m ON m.createdAt = (
            SELECT MAX(m2.createdAt) 
            FROM Message m2 
            WHERE m2.chat.id = c.id
        )
    WHERE p.user.id = :userId
""")
    List<ChatDto> findAllUserChatsWithLastMessage(@Param("userId") UUID userId);


    @Query("SELECT c FROM Chat c WHERE c.isGroupChat = false AND " +
            "EXISTS (SELECT p1 FROM ChatParticipant p1 WHERE p1.chat = c AND p1.user.id = :userAId) AND " +
            "EXISTS (SELECT p2 FROM ChatParticipant p2 WHERE p2.chat = c AND p2.user.id = :userBId)")
    Optional<Chat> findPrivateChatBetweenUsers(@Param("userAId") UUID userAId, @Param("userBId") UUID userBId);
}
