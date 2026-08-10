-- Create Database
CREATE DATABASE IF NOT EXISTS login_system;
USE login_system;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Test Data (Password is 'password123' hashed with BCrypt)
-- Hashed value for 'password123': $2a$10$8.K3pTfU9M6Y9Nn9O9G9E.1i68p2jM1qS/3iH1L/b4U1oM2J1tYJq (Example)
-- Let's provide a real BCrypt hash for 'password123':
-- $2a$10$R9hMcE5g2Y.Qc3D1.sVpI.nLh0gq4i/iLqR0c2v9W0c3s5HhE3aWy
INSERT INTO users (full_name, email, password)
VALUES ('John Doe', 'john.doe@example.com', '$2a$10$R9hMcE5g2Y.Qc3D1.sVpI.nLh0gq4i/iLqR0c2v9W0c3s5HhE3aWy');
