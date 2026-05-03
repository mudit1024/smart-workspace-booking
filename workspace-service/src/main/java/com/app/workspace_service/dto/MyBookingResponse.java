package com.app.workspace_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class MyBookingResponse {

    private UUID bookingId;
    private String status;

    private String workspaceName;
    private String workspaceId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean isHost;
}
