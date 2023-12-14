CREATE TABLE users 
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    profile_description VARCHAR(255) DEFAULT NULL,
    is_active INT DEFAULT 0 NOT NULL,
    activation_hash VARCHAR(255) NOT NULL,
    last_login_date DATETIME NOT NULL,
    avatar_path VARCHAR(255) DEFAULT NULL
);
CREATE TABLE addresses
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    user_id INT NOT NULL,
    ip VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE discussions
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    from_user_id INT NOT NULL,
    to_user_id INT NOT NULL,
    creation_date DATETIME NOT NULL,
    is_active INT NOT NULL,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE messages
(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    discussion_id INT NOT NULL,
    sending_date DATETIME,
    message_body TEXT NOT NULL,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE cipher_keys
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    discussion_id INT NOT NULL,
    user_id INT NOT NULL,
    public_key TEXT NOT NULL,
    private_key TEXT NOT NULL,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);