package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.dto.ChatDto;
import io.everyonecodes.pbltest.entities.ChatParticipant;
import io.everyonecodes.pbltest.entities.ChatParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, ChatParticipantId> {
    @Query("SELECT cp FROM ChatParticipant cp JOIN FETCH cp.user WHERE cp.chat.id IN :chatIds")
    List<ChatParticipant> findAllByChatIdIn(@Param("chatIds") List<UUID> chatIds);
}
