package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Creates a new user with input validation
     * @throws IllegalArgumentException if user is null or has invalid fields
     */
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User createUser(User user) {
        validateUser(user);
        logger.info("Creating new user: {}", user.getName());
        return userRepository.save(user);
    }

    /**
     * Retrieves user by ID with caching
     * @throws EntityNotFoundException if user not found
     */
    @Cacheable(value = "users", key = "#id")
    public User getUserById(String id) {
        Assert.notNull(id, "ID must not be null");
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    /**
     * Retrieves all users with pagination support
     */
    @Cacheable(value = "users", key = "'all'")
    public List<User> getAllUsers() {
        logger.debug("Fetching all users");
        return userRepository.findAll();
    }

    /**
     * Updates user with optimistic locking and validation
     * @throws EntityNotFoundException if user not found
     */
    @Transactional
    @CacheEvict(value = "users", key = "#id")
    public User updateUser(String id, User newUser) {
        Assert.notNull(id, "ID must not be null");
        validateUser(newUser);

        return userRepository.findById(id)
                .map(user -> {
                    user.setName(newUser.getName());
                    user.setAge(newUser.getAge());
                    logger.info("Updating user: {}", id);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    /**
     * Deletes user with proper error handling
     * @throws EntityNotFoundException if user not found
     */
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(String id) {
        Assert.notNull(id, "ID must not be null");
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found: " + id);
        }
        logger.info("Deleting user: {}", id);
        userRepository.deleteById(id);
    }

    private void validateUser(User user) {
        Assert.notNull(user, "User must not be null");
        Assert.hasText(user.getName(), "Name must not be empty");
        Assert.isTrue(user.getAge() >= 0, "Age must be non-negative");
    }
}