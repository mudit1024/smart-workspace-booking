package com.app.workspace_service.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Workspace;
import com.app.workspace_service.repository.WorkspaceRepository;
import com.app.workspace_service.service.WorkspaceService;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository repository;

    @Override
public Workspace createWorkspace(WorkspaceRequest request, String userId) {

    Workspace workspace = Workspace.builder()
            .name(request.getName())
            .type(request.getType())
            .capacity(request.getCapacity())
            .ownerId(UUID.fromString(userId))
            .createdAt(LocalDateTime.now())
            .build();

    return repository.save(workspace);
}
}