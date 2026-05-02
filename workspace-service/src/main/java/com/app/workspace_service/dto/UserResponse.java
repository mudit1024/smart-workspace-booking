package com.app.workspace_service.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
@Getter
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
}
