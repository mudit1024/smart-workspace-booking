package com.app.workspace_service.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntime(RuntimeException ex) {

        String message = ex.getMessage();

        String errorCode = mapError(message);

        HttpStatus status = HttpStatus.BAD_REQUEST;

        ApiErrorResponse response = ApiErrorResponse.builder()
                .error(errorCode)
                .message(message)
                .status(status.value())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(status).body(response);
    }

    private String mapError(String message) {

        if (message == null) return "UNKNOWN_ERROR";

        if (message.contains("Already booked")) return "ALREADY_BOOKED";
        if (message.contains("Slot is full")) return "SLOT_FULL";
        if (message.contains("Workspace not found")) return "WORKSPACE_NOT_FOUND";
        if (message.contains("Slot not found")) return "SLOT_NOT_FOUND";

        return "GENERAL_ERROR";
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneric(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong");
    }
        @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }
}