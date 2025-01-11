package com.example.demo.model;

import java.util.List;

// Violations:
// 1. Unnecessary interface
// 2. Poor naming
public interface IUserRepositoryInterface {
    List<User> findAll();
}
