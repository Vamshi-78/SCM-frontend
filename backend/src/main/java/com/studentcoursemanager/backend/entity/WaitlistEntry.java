package com.studentcoursemanager.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "waitlist")
@Data
public class WaitlistEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "student_username", nullable = false)
    private String studentUsername;

    @Column(name = "course_code", nullable = false)
    private String courseCode;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
