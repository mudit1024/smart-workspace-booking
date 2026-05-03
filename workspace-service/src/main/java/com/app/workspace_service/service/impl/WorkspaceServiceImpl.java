package com.app.workspace_service.service.impl;

import com.app.workspace_service.client.AuthClient;
import lombok.RequiredArgsConstructor;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.workspace_service.dto.BookingRequest;
import com.app.workspace_service.dto.BookingResponse;
import com.app.workspace_service.dto.SlotResponse;
import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.dto.WorkspaceResponse;
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
    private final AuthClient authClient;

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
    public WorkspaceResponse getWorkspaceById(UUID id) {
        Workspace ws = workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        return WorkspaceResponse.builder()
                .id(ws.getId())
                .type(ws.getType())
                .name(ws.getName())
                .capacity(ws.getCapacity())
                .location(ws.getLocation())
                .build();
    }

    @Override
    @Transactional
    public void bookSlot(BookingRequest request, String userId) {

        UUID userUUID = UUID.fromString(userId);

        Slot slot = findOrCreateSlot(request);

        validateBooking(slot, userUUID);

        createBooking(slot, userUUID);
    }

    private Slot findOrCreateSlot(BookingRequest request) {

        List<Slot> slots = slotRepository.findByWorkspaceId(request.getWorkspaceId());

        Optional<Slot> existingSlot = slots.stream()
                .filter(slot ->
                        request.getStartTime().isBefore(slot.getEndTime()) &&
                                request.getEndTime().isAfter(slot.getStartTime())
                )
                .findFirst();

        if (existingSlot.isPresent()) {
            return existingSlot.get();
        }

        Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        Slot newSlot = Slot.builder()
                .workspaceId(request.getWorkspaceId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .capacity(workspace.getCapacity())
                .bookedCount(0)
                .openForJoin(request.isOpenForJoin())
                .build();

        return slotRepository.save(newSlot);
    }


    private void validateBooking(Slot slot, UUID userUUID) {

        if (bookingRepository.existsBySlotIdAndUserId(slot.getId(), userUUID)) {
            throw new RuntimeException("Already booked this slot");
        }

        if (slot.getBookedCount() >= slot.getCapacity()) {
            throw new RuntimeException("Slot is full");
        }
    }

    private void createBooking(Slot slot, UUID userUUID) {

        BookingStatus status = slot.isOpenForJoin()
                ? BookingStatus.APPROVED
                : BookingStatus.PENDING;

        Booking booking = Booking.builder()
                .slotId(slot.getId())
                .userId(userUUID)
                .status(status)
                .isHost(slot.getBookedCount()==0)
                .createdAt(LocalDateTime.now())
                .build();
        if(booking.isHost()){
            booking.setStatus(BookingStatus.APPROVED);
        }
        bookingRepository.save(booking);

        if (booking.getStatus() == BookingStatus.APPROVED ) {
            slot.setBookedCount(slot.getBookedCount() + 1);
            slotRepository.save(slot);
        }
    }

    @Override
    public List<WorkspaceResponse> getWorkspaces(String location) {

        List<Workspace> workspaces = (location != null && !location.isBlank())
                ? workspaceRepository.findByLocationIgnoreCase(location)
                : workspaceRepository.findAll();

        return workspaces.stream()
                .map(w -> WorkspaceResponse.builder()
                        .id(w.getId())
                        .name(w.getName())
                        .type(w.getType())
                        .capacity(w.getCapacity())
                        .location(w.getLocation())
                        .build())
                .toList();
    }

    @Override
    public List<SlotResponse> getSlots(UUID workspaceId) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next48 = now.plusHours(48);

        return slotRepository
                .findByWorkspaceId(workspaceId)
                .stream()
                .map(s -> SlotResponse.builder()
                        .id(s.getId())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .capacity(s.getCapacity())
                        .bookedCount(s.getBookedCount())
                        .openForJoin(s.isOpenForJoin())
                        .build())
                .toList();
    }

    @Override
    public List<BookingResponse> getParticipants(UUID slotId) {
        return bookingRepository.findBySlotId(slotId)
                .stream()
                .map(b -> BookingResponse.builder()
                        .bookingId(b.getId())
                        .userId(b.getUserId())
                        .userName(authClient.getUser(b.getUserId()).getName())
                        .status(b.getStatus().name())
                        .slotId(b.getSlotId())
                        .isHost(b.isHost())
                        .build())
                .toList();
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

        // FIX: ENUM comparison
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        Slot slot = slotRepository.findById(booking.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

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