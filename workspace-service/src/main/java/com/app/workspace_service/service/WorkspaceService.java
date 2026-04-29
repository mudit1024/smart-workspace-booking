package com.app.workspace_service.service;

import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Workspace;

public interface WorkspaceService {

   Workspace createWorkspace(WorkspaceRequest request, String userId);
}