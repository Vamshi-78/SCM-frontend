package com.studentcoursemanager.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studentcoursemanager.backend.entity.RegistrationRequest;
import com.studentcoursemanager.backend.repository.RegistrationRequestRepository;
import com.studentcoursemanager.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/registrations")
public class AdminRegistrationController {

    private final RegistrationRequestRepository registrationRequestRepository;
    private final UserRepository userRepository;

    public AdminRegistrationController(RegistrationRequestRepository registrationRequestRepository, UserRepository userRepository) {
        this.registrationRequestRepository = registrationRequestRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getPendingRegistrations() {
        return ResponseEntity.ok(registrationRequestRepository.findByStatusIgnoreCase("PENDING"));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        RegistrationRequest request = registrationRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
        request.setStatus("APPROVED");
        registrationRequestRepository.save(request);
        userRepository.findByEmail(request.getStudentEmail()).ifPresent(user -> {
            user.setRegistrationApproved(true);
            userRepository.save(user);
        });
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        RegistrationRequest request = registrationRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
        request.setStatus("REJECTED");
        registrationRequestRepository.save(request);
        userRepository.findByEmail(request.getStudentEmail()).ifPresent(user -> {
            user.setRegistrationApproved(false);
            userRepository.save(user);
        });
        return ResponseEntity.ok(Map.of("success", true));
    }
}
