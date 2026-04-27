CREATE DATABASE IF NOT EXISTS pingup
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'pingup_user'@'%' IDENTIFIED BY 'pingup_password';
GRANT ALL PRIVILEGES ON pingup.* TO 'pingup_user'@'%';
FLUSH PRIVILEGES;
