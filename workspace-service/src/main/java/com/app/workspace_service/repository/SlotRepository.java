package com.app.workspace_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.workspace_service.entity.Slot;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SlotRepository extends JpaRepository<Slot, UUID> {

    List<Slot> findByWorkspaceId(UUID workspaceId);


}