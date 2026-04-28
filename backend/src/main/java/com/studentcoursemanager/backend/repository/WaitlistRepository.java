package com.studentcoursemanager.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.WaitlistEntry;

public interface WaitlistRepository extends JpaRepository<WaitlistEntry, Long> {
    List<WaitlistEntry> findByStudentEmail(String studentEmail);
    List<WaitlistEntry> findByCourseCodeOrderByCreatedAtAsc(String courseCode);
    void deleteByStudentEmailAndCourseCode(String studentEmail, String courseCode);
}
