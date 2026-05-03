package com.app.workspace_service.controller;

import com.app.workspace_service.dto.BookingResponse;
import com.app.workspace_service.dto.MyBookingResponse;
import com.app.workspace_service.entity.Booking;
import com.app.workspace_service.service.BookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    @GetMapping("/bookings/my")
    public ResponseEntity<List<MyBookingResponse>> getMyBookings(Authentication auth) {

        // 1. Extract logged-in user ID from JWT
        String userId = (String) auth.getPrincipal();

        // 2. Call service
        List<MyBookingResponse> bookings = bookingService.getMyBookings(userId);

        // 3. Return response
        return ResponseEntity.ok(bookings);
    }
}
