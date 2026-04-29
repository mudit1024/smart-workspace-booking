package com.app.workspace_service.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.app.workspace_service.dto.BookingRequest;
import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Workspace;
import com.app.workspace_service.service.WorkspaceService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService service;

    @PostMapping
    public Workspace create(Authentication authentication,
            @Valid @RequestBody WorkspaceRequest dto) {

        String userId = (String) authentication.getPrincipal();

        return service.createWorkspace(dto, userId);
    }

    @GetMapping("/me")
    public String getUser(Authentication authentication) {

        String userId = (String) authentication.getPrincipal();

        return "User ID: " + userId;
    }

    @PostMapping("/book")
    public void book(Authentication auth,
            @Valid @RequestBody BookingRequest request) {

        String userId = (String) auth.getPrincipal();

        service.bookSlot(request, userId);
    }
}