package com.app.workspace_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.workspace_service.entity.Booking;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findBySlotId(UUID slotId);

    List<Booking> findByUserId(UUID userId);
}