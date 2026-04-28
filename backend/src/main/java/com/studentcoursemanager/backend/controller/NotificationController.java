package com.studentcoursemanager.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studentcoursemanager.backend.entity.AppNotification;
import com.studentcoursemanager.backend.repository.NotificationRepository;

@RestController
@RequestMapping({"/notifications", "/api/notifications"})
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/{userId}")
    public List<AppNotification> getNotifications(@PathVariable String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppNotification notification) {
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        AppNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearAll() {
        notificationRepository.deleteAll();
        return ResponseEntity.ok(Map.of("success", true));
    }
}
