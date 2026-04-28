package com.app.auth_service.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.auth_service.dto.AuthResponse;
import com.app.auth_service.dto.RegisterRequest;
import com.app.auth_service.entity.User;
import com.app.auth_service.repository.UserRepository;
import com.app.auth_service.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .userId(user.getId().toString())
                .role(user.getRole())
                .build();
    }
}