package com.app.auth_service.service;

import com.app.auth_service.dto.AuthResponse;
import com.app.auth_service.dto.LoginRequest;
import com.app.auth_service.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
