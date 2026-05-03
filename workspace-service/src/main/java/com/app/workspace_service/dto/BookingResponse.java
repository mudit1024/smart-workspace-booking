package com.app.workspace_service.dto;


import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BookingResponse {

    private UUID bookingId;
    private UUID userId;
    private UUID slotId;
    private String userName;
    private String status;
    private boolean isHost;
}