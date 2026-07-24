package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.model.ChatParticipant;
import io.everyonecodes.pbltest.model.ChatParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, ChatParticipantId> {
}
