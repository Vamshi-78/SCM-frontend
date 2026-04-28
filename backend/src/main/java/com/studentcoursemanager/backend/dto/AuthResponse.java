package com.studentcoursemanager.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Object user;
    private String token;
    private Integer registrationApproved;
    private String role;
}
