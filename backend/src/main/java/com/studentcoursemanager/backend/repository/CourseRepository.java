package com.studentcoursemanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studentcoursemanager.backend.entity.Course;

public interface CourseRepository extends JpaRepository<Course, String> {
}
