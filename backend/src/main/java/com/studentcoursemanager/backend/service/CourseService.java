package com.studentcoursemanager.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.studentcoursemanager.backend.entity.Course;
import com.studentcoursemanager.backend.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course addCourse(Course course) {
        course.setCode(course.getCode().trim().toUpperCase());
        return courseRepository.save(course);
    }

    public Course updateCourse(String code, Course updated) {
        Course existing = courseRepository.findById(code.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        existing.setName(updated.getName());
        existing.setDay(updated.getDay());
        existing.setTime(updated.getTime());
        existing.setCredits(updated.getCredits());
        existing.setCapacity(updated.getCapacity());
        existing.setPrerequisites(updated.getPrerequisites());
        return courseRepository.save(existing);
    }

    public void deleteCourse(String code) {
        if (!courseRepository.existsById(code.trim().toUpperCase())) {
            throw new IllegalArgumentException("Course not found");
        }
        courseRepository.deleteById(code.trim().toUpperCase());
    }
}
