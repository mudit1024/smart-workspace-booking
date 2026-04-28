package com.app.auth_service.dto;


import lombok.Getter;

@Getter
public class RefreshRequest {
    private String refreshToken;
}