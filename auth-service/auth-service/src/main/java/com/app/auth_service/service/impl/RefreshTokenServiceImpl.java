package com.app.auth_service.service.impl;



import lombok.RequiredArgsConstructor;
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

    private final long REFRESH_EXPIRATION = 1000 * 60 * 60 * 24; // 1 day

    @Override
    public RefreshToken createRefreshToken(String userId) {

        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .userId(UUID.fromString(userId))
                .expiryDate(Instant.now().plusMillis(REFRESH_EXPIRATION))
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