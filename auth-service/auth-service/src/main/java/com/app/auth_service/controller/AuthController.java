package com.app.auth_service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.app.auth_service.dto.AuthResponse;
import com.app.auth_service.dto.LoginRequest;
import com.app.auth_service.dto.RefreshRequest;
import com.app.auth_service.dto.RegisterRequest;
import com.app.auth_service.entity.RefreshToken;
import com.app.auth_service.service.AuthService;
import com.app.auth_service.service.RefreshTokenService;
import com.app.auth_service.util.JwtUtil;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestBody RefreshRequest request) {

        RefreshToken token = refreshTokenService.verifyToken(request.getRefreshToken());

        String accessToken = jwtUtil.generateToken(token.getUserId(), "USER");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(token.getToken())
                .userId(token.getUserId().toString())
                .role("USER")
                .build();
    }

    @PostMapping("/logout")
    public String logout(@RequestBody RefreshRequest request) {

        refreshTokenService.revokeToken(request.getRefreshToken());
        return "Logged out successfully";
    }
}
