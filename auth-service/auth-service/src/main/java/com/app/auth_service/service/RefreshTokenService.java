package com.app.auth_service.service;

import com.app.auth_service.entity.RefreshToken;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(String userId);

    RefreshToken verifyToken(String token);

    void revokeToken(String token);
}