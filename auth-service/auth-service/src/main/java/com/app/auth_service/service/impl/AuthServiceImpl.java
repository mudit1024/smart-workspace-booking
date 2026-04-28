package com.app.auth_service.service.impl;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.auth_service.dto.AuthResponse;
import com.app.auth_service.dto.LoginRequest;
import com.app.auth_service.dto.RegisterRequest;
import com.app.auth_service.entity.User;
import com.app.auth_service.repository.UserRepository;
import com.app.auth_service.service.AuthService;
import com.app.auth_service.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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


    @Override
public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid credentials");
    }

    String token = jwtUtil.generateToken(user.getId(), user.getRole());

    return AuthResponse.builder()
            .accessToken(token)
            .userId(user.getId().toString())
            .role(user.getRole())
            .build();
}
}