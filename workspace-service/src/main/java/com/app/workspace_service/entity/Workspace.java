package com.app.workspace_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "workspaces")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workspace {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    private String type;

    private int capacity;

    private UUID ownerId;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String location;
}
