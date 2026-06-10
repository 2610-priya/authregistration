package com.authspace.backend.repository;

import com.authspace.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for MongoDB queries mapping the "users" collection.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find a user by their registered email address.
     * @param email The unique email to search.
     * @return Optional containing the User if found.
     */
    Optional<User> findByEmail(String email);
}
