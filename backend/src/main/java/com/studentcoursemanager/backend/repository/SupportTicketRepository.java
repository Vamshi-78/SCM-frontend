package com.studentcoursemanager.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.SupportTicket;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByStudentEmailOrderByCreatedAtDesc(String studentEmail);
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}
