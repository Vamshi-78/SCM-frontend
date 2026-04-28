package com.studentcoursemanager.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.RegistrationRequest;

public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
    Optional<RegistrationRequest> findByStudentEmail(String studentEmail);
    List<RegistrationRequest> findByStatusIgnoreCase(String status);
}
