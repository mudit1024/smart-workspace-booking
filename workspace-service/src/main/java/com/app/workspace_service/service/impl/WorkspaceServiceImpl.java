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

    private final WorkspaceRepository workspaceRepository;
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

        return workspaceRepository.save(workspace);
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

            Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
        .orElseThrow(() -> new RuntimeException("Workspace not found"));

Slot newSlot = Slot.builder()
        .workspaceId(request.getWorkspaceId())
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .capacity(workspace.getCapacity()) 
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
            return workspaceRepository.findByLocationIgnoreCase(location);
        }

        return workspaceRepository.findAll();
    }

    @Override
    public List<Slot> getSlots(UUID workspaceId) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next48 = now.plusHours(48);

        return slotRepository.findByWorkspaceIdAndStartTimeBetween(
                workspaceId, now, next48);
    }

    @Override
    public List<Booking> getParticipants(UUID slotId) {

        return bookingRepository.findBySlotId(slotId)
        .stream()
        .filter(b -> b.getStatus().equals("APPROVED"))
        .toList();
    }


    @Override
public void cancelBooking(UUID bookingId, String userId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    // only booking owner can cancel
    if (!booking.getUserId().toString().equals(userId)) {
        throw new RuntimeException("Unauthorized");
    }

    // if already cancelled
    if (booking.getStatus().equals("CANCELLED")) {
        throw new RuntimeException("Already cancelled");
    }

    Slot slot = slotRepository.findById(booking.getSlotId())
            .orElseThrow(() -> new RuntimeException("Slot not found"));

    // HOST CASE
    if (booking.isHost()) {

        // delete all bookings
        bookingRepository.deleteAll(
                bookingRepository.findBySlotId(slot.getId())
        );

        // delete slot
        slotRepository.delete(slot);

        return;
    }

    // NORMAL USER

    // reduce count only if approved
    if (booking.getStatus().equals("APPROVED")) {
        slot.setBookedCount(slot.getBookedCount() - 1);
        slotRepository.save(slot);
    }

    booking.setStatus("CANCELLED");
    bookingRepository.save(booking);
}
}