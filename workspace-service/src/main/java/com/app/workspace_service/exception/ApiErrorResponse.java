package com.app.workspace_service.exception;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiErrorResponse {
    private String error;
    private String message;
    private int status;
    private LocalDateTime timestamp;
}
