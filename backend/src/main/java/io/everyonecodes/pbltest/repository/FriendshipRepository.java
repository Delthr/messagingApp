package io.everyonecodes.pbltest.repository;

import io.everyonecodes.pbltest.entities.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    @Query("SELECT f FROM Friendship f WHERE " +
            "(f.inviting.id = :senderId AND f.receiver.id = :receiverId) OR " +
            "(f.inviting.id = :receiverId AND f.receiver.id = :senderId)")
    Optional<Friendship> findExistingFriendship(@Param("senderId") UUID senderId, @Param("receiverId") UUID receiverId);

    Friendship findFriendshipByReceiverId(UUID id);

    List<Friendship> findAllByStatusAndInvitingIdOrStatusAndReceiverId(String status1, UUID invitingId, String status2, UUID receiverId);
    List<Friendship> findAllByStatusAndReceiverId(String status, UUID receiverId);
}
