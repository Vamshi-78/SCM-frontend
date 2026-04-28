package com.studentcoursemanager.backend.controller;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studentcoursemanager.backend.entity.AppNotification;
import com.studentcoursemanager.backend.entity.SupportResponse;
import com.studentcoursemanager.backend.entity.SupportTicket;
import com.studentcoursemanager.backend.repository.NotificationRepository;
import com.studentcoursemanager.backend.repository.SupportResponseRepository;
import com.studentcoursemanager.backend.repository.SupportTicketRepository;

@RestController
@RequestMapping({"/support-tickets", "/api/support-tickets"})
public class SupportTicketController {

    private final SupportTicketRepository supportTicketRepository;
    private final SupportResponseRepository supportResponseRepository;
    private final NotificationRepository notificationRepository;

    public SupportTicketController(SupportTicketRepository supportTicketRepository,
                                   SupportResponseRepository supportResponseRepository,
                                   NotificationRepository notificationRepository) {
        this.supportTicketRepository = supportTicketRepository;
        this.supportResponseRepository = supportResponseRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/{email}")
    public List<Map<String, Object>> getTickets(@PathVariable String email) {
        return supportTicketRepository.findByStudentEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toTicketResponse)
                .toList();
    }

    @GetMapping("/all")
    public List<Map<String, Object>> getAllTickets() {
        return supportTicketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toTicketResponse)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody SupportTicket ticket) {
        ticket.setStatus(ticket.getStatus() == null ? "OPEN" : ticket.getStatus());
        SupportTicket saved = supportTicketRepository.save(ticket);

        AppNotification notification = new AppNotification();
        notification.setUserId(saved.getStudentEmail());
        notification.setUserType("student");
        notification.setType("support");
        notification.setTitle("Support Ticket Created");
        notification.setMessage("Your support ticket has been created.");
        notificationRepository.save(notification);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("id", saved.getId());
        response.put("studentEmail", saved.getStudentEmail());
        response.put("studentUsername", saved.getStudentUsername());
        response.put("subject", saved.getSubject());
        response.put("description", saved.getDescription());
        response.put("category", saved.getCategory());
        response.put("status", saved.getStatus());
        response.put("priority", saved.getPriority());
        response.put("createdAt", saved.getCreatedAt());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/respond")
    public ResponseEntity<?> respond(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        SupportResponse response = new SupportResponse();
        response.setTicket(ticket);
        response.setResponseBy(String.valueOf(body.get("by")));
        response.setResponseRole(String.valueOf(body.get("role")));
        response.setMessage(String.valueOf(body.get("message")));
        supportResponseRepository.save(response);
        ticket.setStatus("REPLIED");
        supportTicketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        ticket.setStatus(String.valueOf(body.get("status")));
        supportTicketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("success", true));
    }

    private Map<String, Object> toTicketResponse(SupportTicket ticket) {
        List<Map<String, Object>> responseRows = ticket.getResponses() == null ? List.of() : ticket.getResponses().stream()
                .map(resp -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("by", resp.getResponseBy());
                    row.put("role", resp.getResponseRole());
                    row.put("message", resp.getMessage());
                    row.put("timestamp", resp.getCreatedAt());
                    return row;
                })
                .toList();

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", ticket.getId());
        row.put("studentEmail", ticket.getStudentEmail());
        row.put("studentUsername", ticket.getStudentUsername());
        row.put("subject", ticket.getSubject());
        row.put("description", ticket.getDescription());
        row.put("category", ticket.getCategory());
        row.put("status", ticket.getStatus());
        row.put("priority", ticket.getPriority());
        row.put("createdAt", ticket.getCreatedAt());
        row.put("updatedAt", ticket.getUpdatedAt());
        row.put("responses", responseRows);
        return row;
    }
}
