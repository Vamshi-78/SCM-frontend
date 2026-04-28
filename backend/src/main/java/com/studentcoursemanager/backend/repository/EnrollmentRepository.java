package com.studentcoursemanager.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentEmail(String studentEmail);
    Optional<Enrollment> findByStudentEmailAndCourseCode(String studentEmail, String courseCode);
    long countByStudentEmail(String studentEmail);
    long countByCourseCode(String courseCode);
    void deleteByStudentEmailAndCourseCode(String studentEmail, String courseCode);
}
