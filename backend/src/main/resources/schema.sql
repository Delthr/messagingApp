DROP TABLE IF EXISTS friendships CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_participant CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS authority CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users
(
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS authority
(
    authority_id UUID PRIMARY KEY,
    authority_type SMALLINT NOTNULL,
    user_id UUID NOT NULL,
    CONSTRAINT fk_authority_user FOREIGN KEY(user_id) REFERENCES users (user_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS chats
(
    chat_id UUID PRIMARYKEY,
    created_at TIMESTAMP NOT NULL,
    is_group BOOLEAN NOT NULL,
    name VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS chat_participant
(
    user_id UUID NOT NULL,
    chat_id UUID NOT NULL,
    joined_at TIMESTAMP NOTNULL,
    PRIMARY KEY( user_id, chat_id), CONSTRAINT fk_participant_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_participant_chat FOREIGN KEY (chat_id) REFERENCES chats(chat_id)ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS messages
(
    message_id UUID NOT NULL,
    chat_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    status VARCHAR(50),
    text VARCHAR(MAX),
    PRIMARY KEY (message_id, sender_id),
    CONSTRAINT fk_message_chat FOREIGN KEY(chat_id) REFERENCES chats(chat_id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY(sender_id) REFERENCES users(user_id)ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS friendships
(
    friendship_id UUID PRIMARY KEY,
    inviting_user_id UUID NOT NULL,
    receiver_user_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_friendship_inviting FOREIGN KEY(inviting_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_friendship_receiver FOREIGN KEY(receiver_user_id) REFERENCES users(user_id)ON DELETE CASCADE
);