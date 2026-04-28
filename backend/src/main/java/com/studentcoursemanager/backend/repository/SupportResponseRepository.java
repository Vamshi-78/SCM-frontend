package com.studentcoursemanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.SupportResponse;

public interface SupportResponseRepository extends JpaRepository<SupportResponse, Long> {
}
