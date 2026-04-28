package com.app.auth_service.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.app.auth_service.entity.RefreshToken;
import com.app.auth_service.repository.RefreshTokenRepository;
import com.app.auth_service.service.RefreshTokenService;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository repository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    @Override
    public RefreshToken createRefreshToken(String userId) {

        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .userId(UUID.fromString(userId))
                .expiryDate(Instant.now().plusMillis(refreshExpiration))
                .isActive(true)
                .build();

        return repository.save(token);
    }

    @Override
    public RefreshToken verifyToken(String token) {

        RefreshToken refreshToken = repository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (!refreshToken.isActive() || refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new RuntimeException("Refresh token expired");
        }

        return refreshToken;
    }

    @Override
    public void revokeToken(String token) {

        RefreshToken refreshToken = repository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        refreshToken.setActive(false);
        repository.save(refreshToken);
    }
}