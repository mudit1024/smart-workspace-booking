package com.app.workspace_service.service;

import java.util.List;
import java.util.UUID;

import com.app.workspace_service.dto.BookingRequest;
import com.app.workspace_service.dto.WorkspaceRequest;
import com.app.workspace_service.entity.Booking;
import com.app.workspace_service.entity.Slot;
import com.app.workspace_service.entity.Workspace;

public interface WorkspaceService {

   Workspace createWorkspace(WorkspaceRequest request, String userId);

   void bookSlot(BookingRequest request, String userId);

   List<Workspace> getWorkspaces(String location);

   List<Slot> getSlots(UUID workspaceId);

   List<Booking> getParticipants(UUID slotId);

   void cancelBooking(UUID bookingId, String userId);

   void approveBooking(UUID bookingId, String userId);

   void rejectBooking(UUID bookingId, String userId);
}