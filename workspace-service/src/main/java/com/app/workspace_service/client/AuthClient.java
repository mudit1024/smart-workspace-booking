package com.app.workspace_service.client;

import com.app.workspace_service.dto.UserResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(
        name = "auth-service",
        url = "${auth-service.url}"
)
public interface AuthClient {

    @GetMapping("/users/{userId}")
    UserResponse getUser(@PathVariable UUID userId);
}
