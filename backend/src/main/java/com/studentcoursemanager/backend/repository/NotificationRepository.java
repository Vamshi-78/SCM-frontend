package com.studentcoursemanager.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.AppNotification;

public interface NotificationRepository extends JpaRepository<AppNotification, Long> {
    List<AppNotification> findByUserIdOrderByTimestampDesc(String userId);
}
