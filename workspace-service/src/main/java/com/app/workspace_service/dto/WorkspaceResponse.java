package com.app.workspace_service.dto;


import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class WorkspaceResponse {

    private UUID id;
    private String name;
    private String type;
    private int capacity;
    private String location;
}