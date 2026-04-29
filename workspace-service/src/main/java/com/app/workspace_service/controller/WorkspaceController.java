package com.app.workspace_service.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
public Workspace create(HttpServletRequest request,
                        @Valid @RequestBody WorkspaceRequest dto) {

    String userId = (String) request.getAttribute("userId");

    return service.createWorkspace(dto, userId);
}
}