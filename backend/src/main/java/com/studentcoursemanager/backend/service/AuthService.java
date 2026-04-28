package com.studentcoursemanager.backend.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studentcoursemanager.backend.dto.LoginRequest;
import com.studentcoursemanager.backend.dto.RegisterRequest;
import com.studentcoursemanager.backend.entity.RegistrationRequest;
import com.studentcoursemanager.backend.entity.User;
import com.studentcoursemanager.backend.repository.RegistrationRequestRepository;
import com.studentcoursemanager.backend.repository.UserRepository;
import com.studentcoursemanager.backend.security.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RegistrationRequestRepository registrationRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       RegistrationRequestRepository registrationRequestRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.registrationRequestRepository = registrationRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("student");
        user.setRegistrationApproved(false);
        userRepository.save(user);

        RegistrationRequest reg = new RegistrationRequest();
        reg.setStudentEmail(email);
        reg.setStudentUsername(user.getUsername());
        reg.setStatus("PENDING");
        registrationRequestRepository.save(reg);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return Map.of(
                "user", user,
                "token", token,
            "registrationApproved", 0
        );
    }

    public Map<String, Object> loginStudent(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return Map.of(
                "user", user,
                "token", token,
                "registrationApproved", user.isRegistrationApproved() ? 1 : 0,
                "role", user.getRole()
        );
    }

    public Map<String, Object> loginAdmin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid admin credentials"));

        if (!"admin".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return Map.of(
                "user", user,
                "token", token,
                "role", "admin"
        );
    }
}
