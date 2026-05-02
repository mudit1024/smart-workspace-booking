package com.app.workspace_service.dto;


import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BookingResponse {

    private UUID userId;
    private String userName;
    private String status;
    private boolean isHost;
}