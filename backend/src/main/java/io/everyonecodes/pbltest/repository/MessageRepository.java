package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.entities.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    Slice<Message> findMessageByChatId(UUID chat, Pageable pageable);

}
