package com.app.workspace_service.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.app.workspace_service.dto.BookingRequest;
import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Booking;
import com.app.workspace_service.entity.Slot;
import com.app.workspace_service.entity.Workspace;
import com.app.workspace_service.repository.BookingRepository;
import com.app.workspace_service.repository.SlotRepository;
import com.app.workspace_service.repository.WorkspaceRepository;
import com.app.workspace_service.service.WorkspaceService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository repository;
    private final SlotRepository slotRepository;
    private final BookingRepository bookingRepository;

    @Override
    public Workspace createWorkspace(WorkspaceRequest request, String userId) {

        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .ownerId(UUID.fromString(userId))
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(workspace);
    }

    @Override
    public void bookSlot(BookingRequest request, String userId) {

        // 1. Find existing slots for workspace
        List<Slot> slots = slotRepository.findByWorkspaceId(request.getWorkspaceId());

        // 2. Check for overlapping slot
        Optional<Slot> existingSlot = slots.stream()
                .filter(slot -> request.getStartTime().isBefore(slot.getEndTime()) &&
                        request.getEndTime().isAfter(slot.getStartTime()))
                .findFirst();

        if (existingSlot.isEmpty()) {

            // 🎯 CASE 1: Create new slot

            Slot newSlot = Slot.builder()
                    .workspaceId(request.getWorkspaceId())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .capacity(5) // temporary (later from workspace)
                    .bookedCount(1)
                    .openForJoin(request.isOpenForJoin())
                    .build();

            slotRepository.save(newSlot);

            Booking booking = Booking.builder()
                    .slotId(newSlot.getId())
                    .userId(UUID.fromString(userId))
                    .status("APPROVED")
                    .isHost(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            bookingRepository.save(booking);

            return;
        }

        // 🎯 CASE 2: Slot exists
        Slot slot = existingSlot.get();

        if (slot.getBookedCount() >= slot.getCapacity()) {
            throw new RuntimeException("Slot full");
        }

        // decide status
        String status = slot.isOpenForJoin() ? "APPROVED" : "PENDING";

        Booking booking = Booking.builder()
                .slotId(slot.getId())
                .userId(UUID.fromString(userId))
                .status(status)
                .isHost(false)
                .createdAt(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);

        // update count ONLY if approved
        if (status.equals("APPROVED")) {
            slot.setBookedCount(slot.getBookedCount() + 1);
            slotRepository.save(slot);
        }
    }

    @Override
public List<Workspace> getWorkspaces(String location) {

    if (location != null && !location.isBlank()) {
        return repository.findByLocationIgnoreCase(location);
    }

    return repository.findAll();
}
}