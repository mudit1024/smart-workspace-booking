package com.app.workspace_service.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SlotResponse {

    private UUID id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int capacity;
    private int bookedCount;
    private boolean openForJoin;
}