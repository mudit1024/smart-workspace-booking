package com.app.workspace_service.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.workspace_service.dto.BookingRequest;
import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Booking;
import com.app.workspace_service.entity.BookingStatus;
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
@Transactional
public void bookSlot(BookingRequest request, String userId) {

    List<Slot> slots = slotRepository.findByWorkspaceId(request.getWorkspaceId());

    Optional<Slot> existingSlot = slots.stream()
            .filter(slot -> request.getStartTime().isBefore(slot.getEndTime()) &&
                    request.getEndTime().isAfter(slot.getStartTime()))
            .findFirst();

    UUID userUUID = UUID.fromString(userId);

    if (existingSlot.isEmpty()) {

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
                .userId(userUUID)
                .status(BookingStatus.APPROVED)
                .isHost(true)
                .createdAt(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);
        return;
    }

    Slot slot = existingSlot.get();

    // ❗ duplicate booking check
    if (bookingRepository.existsBySlotIdAndUserId(slot.getId(), userUUID)) {
        throw new RuntimeException("Already booked this slot");
    }

    try {
        BookingStatus status = slot.isOpenForJoin()
                ? BookingStatus.APPROVED
                : BookingStatus.PENDING;

        Booking booking = Booking.builder()
                .slotId(slot.getId())
                .userId(userUUID)
                .status(status)
                .isHost(false)
                .createdAt(LocalDateTime.now())
                .build();

        bookingRepository.save(booking);

        if (status == BookingStatus.APPROVED) {
            slot.setBookedCount(slot.getBookedCount() + 1);
            slotRepository.save(slot);
        }

    } catch (ObjectOptimisticLockingFailureException e) {
        throw new RuntimeException("Slot just got filled, try again");
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

        return bookingRepository.findBySlotId(slotId);
        // .stream()
        // .filter(b -> b.getStatus().equals("APPROVED"))
        // .toList();
    }


@Override
@Transactional
public void cancelBooking(UUID bookingId, String userId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!booking.getUserId().toString().equals(userId)) {
        throw new RuntimeException("Unauthorized");
    }

    if (booking.getStatus() == BookingStatus.CANCELLED) {
        throw new RuntimeException("Already cancelled");
    }

    Slot slot = slotRepository.findById(booking.getSlotId())
            .orElseThrow(() -> new RuntimeException("Slot not found"));

    if (booking.isHost()) {
        bookingRepository.deleteAll(bookingRepository.findBySlotId(slot.getId()));
        slotRepository.delete(slot);
        return;
    }

    if (booking.getStatus() == BookingStatus.APPROVED) {
        slot.setBookedCount(slot.getBookedCount() - 1);
        slotRepository.save(slot);
    }

    booking.setStatus(BookingStatus.CANCELLED);
    bookingRepository.save(booking);
}
@Override
@Transactional
public void approveBooking(UUID bookingId, String userId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.PENDING) {
        throw new RuntimeException("Only pending bookings can be approved");
    }

    Slot slot = slotRepository.findById(booking.getSlotId())
            .orElseThrow(() -> new RuntimeException("Slot not found"));

    Booking host = bookingRepository.findBySlotId(slot.getId())
            .stream()
            .filter(Booking::isHost)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Host not found"));

    if (!host.getUserId().toString().equals(userId)) {
        throw new RuntimeException("Only host can approve");
    }

    try {
        booking.setStatus(BookingStatus.APPROVED);
        bookingRepository.save(booking);

        slot.setBookedCount(slot.getBookedCount() + 1);
        slotRepository.save(slot);

    } catch (ObjectOptimisticLockingFailureException e) {
        throw new RuntimeException("Slot just got filled, try again");
    }
}

@Override
public void rejectBooking(UUID bookingId, String userId) {

    Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (!booking.getStatus().equals("PENDING")) {
        throw new RuntimeException("Only pending bookings can be rejected");
    }

    Slot slot = slotRepository.findById(booking.getSlotId())
            .orElseThrow(() -> new RuntimeException("Slot not found"));

    // find HOST
    Booking host = bookingRepository.findBySlotId(slot.getId())
            .stream()
            .filter(Booking::isHost)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Host not found"));

    if (!host.getUserId().toString().equals(userId)) {
        throw new RuntimeException("Only host can reject");
    }

    booking.setStatus(BookingStatus.REJECTED);
    bookingRepository.save(booking);
}
}