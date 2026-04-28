package com.app.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.auth_service.entity.RefreshToken;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByToken(String token);
}