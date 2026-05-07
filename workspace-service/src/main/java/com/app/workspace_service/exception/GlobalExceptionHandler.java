package com.app.workspace_service.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =====================================================
    // VALIDATION ERRORS
    // =====================================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {

            errors.put(
                    error.getField(),
                    error.getDefaultMessage()
            );
        }

        return ResponseEntity.badRequest().body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "error", "VALIDATION_FAILED",
                        "messages", errors
                )
        );
    }

    // =====================================================
    // DATABASE ERRORS
    // =====================================================

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDatabase(
            DataIntegrityViolationException ex
    ) {

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 409,
                        "error", "DATABASE_ERROR",
                        "message", "Database operation failed"
                )
        );
    }

    // =====================================================
    // BUSINESS / RUNTIME ERRORS
    // =====================================================

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntime(
            RuntimeException ex
    ) {

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

    // =====================================================
    // GENERIC FALLBACK
    // =====================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneric(Exception ex) {

        ex.printStackTrace();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        Map.of(
                                "timestamp", LocalDateTime.now(),
                                "status", 500,
                                "error", "INTERNAL_SERVER_ERROR",
                                "message", "Something went wrong"
                        )
                );
    }

    // =====================================================
    // ERROR CODE MAPPING
    // =====================================================

    private String mapError(String message) {

        if (message == null) {
            return "UNKNOWN_ERROR";
        }

        if (message.contains("Already booked")) {
            return "ALREADY_BOOKED";
        }

        if (message.contains("Slot is full")) {
            return "SLOT_FULL";
        }

        if (message.contains("Workspace not found")) {
            return "WORKSPACE_NOT_FOUND";
        }

        if (message.contains("Slot not found")) {
            return "SLOT_NOT_FOUND";
        }

        if (message.contains("Unauthorized")) {
            return "UNAUTHORIZED";
        }

        return "GENERAL_ERROR";
    }
}