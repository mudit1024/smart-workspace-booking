package com.app.workspace_service.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class WorkspaceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 100, message = "Capacity cannot exceed 100")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;
}