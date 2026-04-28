package com.studentcoursemanager.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "notification")
@Data
public class AppNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "user_type")
    private String userType;

    private String type;
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String message;

    @Column(name = "is_read")
    private boolean read = false;

    private LocalDateTime timestamp = LocalDateTime.now();
}
