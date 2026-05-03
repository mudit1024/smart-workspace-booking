package com.app.workspace_service.service.impl;

import com.app.workspace_service.client.AuthClient;
import com.app.workspace_service.dto.BookingResponse;
import com.app.workspace_service.dto.MyBookingResponse;
import com.app.workspace_service.entity.Booking;
import com.app.workspace_service.entity.Slot;
import com.app.workspace_service.entity.Workspace;
import com.app.workspace_service.repository.BookingRepository;
import com.app.workspace_service.repository.SlotRepository;
import com.app.workspace_service.repository.WorkspaceRepository;
import com.app.workspace_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final SlotRepository slotRepository;
    private final WorkspaceRepository workspaceRepository;
    private final AuthClient authClient;
    @Override
    public List<MyBookingResponse> getMyBookings(String userId) {
        String name = authClient.getUser(UUID.fromString(userId)).getName();
        UUID uid = UUID.fromString(userId);

        List<Booking> bookings = bookingRepository.findByUserId(uid);

        return bookings.stream().map(booking -> {

            // 1. Fetch Slot
            Slot slot = slotRepository.findById(booking.getSlotId())
                    .orElseThrow(() -> new RuntimeException("Slot not found"));

            // 2. Fetch Workspace
            Workspace workspace = workspaceRepository.findById(slot.getWorkspaceId())
                    .orElseThrow(() -> new RuntimeException("Workspace not found"));

            // 3. Map to DTO
            return MyBookingResponse.builder()
                    .bookingId(booking.getId())
                    .status(booking.getStatus().name())
                    .workspaceName(workspace.getName())
                    .workspaceId(workspace.getId().toString())
                    .startTime(slot.getStartTime())
                    .endTime(slot.getEndTime())
                    .isHost(booking.isHost())
                    .build();
        }).toList();

    }
}
