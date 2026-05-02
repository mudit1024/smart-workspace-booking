package com.app.auth_service.service;

import com.app.auth_service.dto.UserResponse;

import java.util.UUID;

public interface UserService {

    public UserResponse getUserById(UUID userId);
}
