package com.app.workspace_service.controller;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.app.workspace_service.dto.BookingRequest;
import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Booking;
import com.app.workspace_service.entity.Slot;
import com.app.workspace_service.entity.Workspace;
import com.app.workspace_service.service.WorkspaceService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService service;

    @PostMapping
    public Workspace create(Authentication authentication,
            @Valid @RequestBody WorkspaceRequest dto) {

        String userId = (String) authentication.getPrincipal();

        return service.createWorkspace(dto, userId);
    }

    @GetMapping("/me")
    public String getUser(Authentication authentication) {

        String userId = (String) authentication.getPrincipal();

        return "User ID: " + userId;
    }

    @PostMapping("/book")
    public ResponseEntity<String> book(Authentication auth,
            @Valid @RequestBody BookingRequest request) {

        String userId = (String) auth.getPrincipal();

        service.bookSlot(request, userId);

        return ResponseEntity.ok("Booking processed successfully");
    }

    @GetMapping
    public ResponseEntity<List<Workspace>> getWorkspaces(
            @RequestParam(required = false) String location) {

        return ResponseEntity.ok(service.getWorkspaces(location));
    }

    @GetMapping("/{workspaceId}/slots")
    public ResponseEntity<List<Slot>> getSlots(@PathVariable UUID workspaceId) {

        return ResponseEntity.ok(service.getSlots(workspaceId));
    }

    @GetMapping("/slots/{slotId}/participants")
    public ResponseEntity<List<Booking>> getParticipants(@PathVariable UUID slotId) {

        return ResponseEntity.ok(service.getParticipants(slotId));
    }

    @PostMapping("/booking/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(
            Authentication auth,
            @PathVariable UUID bookingId) {

        String userId = (String) auth.getPrincipal();

        service.cancelBooking(bookingId, userId);

        return ResponseEntity.ok("Booking cancelled");
    }

    @PostMapping("/booking/{bookingId}/approve")
    public ResponseEntity<String> approve(
            Authentication auth,
            @PathVariable UUID bookingId) {

        String userId = (String) auth.getPrincipal();

        service.approveBooking(bookingId, userId);

        return ResponseEntity.ok("Booking approved");
    }

    @PostMapping("/booking/{bookingId}/reject")
    public ResponseEntity<String> reject(
            Authentication auth,
            @PathVariable UUID bookingId) {

        String userId = (String) auth.getPrincipal();

        service.rejectBooking(bookingId, userId);

        return ResponseEntity.ok("Booking rejected");
    }

}