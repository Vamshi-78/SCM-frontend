package com.studentcoursemanager.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studentcoursemanager.backend.entity.AppNotification;
import com.studentcoursemanager.backend.entity.Course;
import com.studentcoursemanager.backend.entity.Enrollment;
import com.studentcoursemanager.backend.entity.WaitlistEntry;
import com.studentcoursemanager.backend.repository.CourseRepository;
import com.studentcoursemanager.backend.repository.EnrollmentRepository;
import com.studentcoursemanager.backend.repository.NotificationRepository;
import com.studentcoursemanager.backend.repository.WaitlistRepository;

@RestController
@RequestMapping({"", "/api"})
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final WaitlistRepository waitlistRepository;
    private final NotificationRepository notificationRepository;

    public EnrollmentController(EnrollmentRepository enrollmentRepository,
                                CourseRepository courseRepository,
                                WaitlistRepository waitlistRepository,
                                NotificationRepository notificationRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.waitlistRepository = waitlistRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/enrollments/{email}")
    public List<Map<String, Object>> getEnrollments(@org.springframework.web.bind.annotation.PathVariable String email) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentEmail(email);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            Course course = courseRepository.findById(enrollment.getCourseCode()).orElse(null);
            Map<String, Object> row = new HashMap<>();
            row.put("studentEmail", enrollment.getStudentEmail());
            row.put("studentUsername", enrollment.getStudentUsername());
            row.put("course", course);
            result.add(row);
        }
        return result;
    }

    @PostMapping("/enroll")
    @Transactional
    public ResponseEntity<?> enroll(@RequestBody Map<String, Object> body) {
        String studentEmail = String.valueOf(body.get("studentEmail"));
        String studentUsername = String.valueOf(body.get("studentUsername"));
        String courseCode = String.valueOf(body.get("courseCode")).trim().toUpperCase();

        Course course = courseRepository.findById(courseCode)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        if (enrollmentRepository.findByStudentEmailAndCourseCode(studentEmail, courseCode).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already enrolled"));
        }

        if (course.getCapacity() != null && course.getEnrolled() != null && course.getEnrolled() >= course.getCapacity()) {
            WaitlistEntry waitlist = new WaitlistEntry();
            waitlist.setStudentEmail(studentEmail);
            waitlist.setStudentUsername(studentUsername);
            waitlist.setCourseCode(courseCode);
            waitlistRepository.save(waitlist);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "enrolled", false,
                    "waitlisted", true,
                    "message", "Course full. Added to waitlist"
            ));
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentEmail(studentEmail);
        enrollment.setStudentUsername(studentUsername);
        enrollment.setCourseCode(courseCode);
        enrollmentRepository.save(enrollment);

        course.setEnrolled((course.getEnrolled() == null ? 0 : course.getEnrolled()) + 1);
        courseRepository.save(course);

        AppNotification notification = new AppNotification();
        notification.setUserId(studentEmail);
        notification.setUserType("student");
        notification.setType("enrollment");
        notification.setTitle("Enrollment Successful");
        notification.setMessage("You have been enrolled in " + course.getName());
        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "enrolled", true,
                "waitlisted", false,
                "message", "Enrolled successfully"
        ));
    }

    @PostMapping("/unenroll")
    @Transactional
    public ResponseEntity<?> unenroll(@RequestBody Map<String, Object> body) {
        String studentEmail = String.valueOf(body.get("studentEmail"));
        String courseCode = String.valueOf(body.get("courseCode")).trim().toUpperCase();

        Enrollment enrollment = enrollmentRepository.findByStudentEmailAndCourseCode(studentEmail, courseCode)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));
        enrollmentRepository.delete(enrollment);

        Course course = courseRepository.findById(courseCode).orElse(null);
        if (course != null && course.getEnrolled() != null && course.getEnrolled() > 0) {
            course.setEnrolled(course.getEnrolled() - 1);
            courseRepository.save(course);
        }

        List<WaitlistEntry> waitlist = waitlistRepository.findByCourseCodeOrderByCreatedAtAsc(courseCode);
        if (!waitlist.isEmpty()) {
            WaitlistEntry next = waitlist.get(0);
            waitlistRepository.delete(next);

            Enrollment promoted = new Enrollment();
            promoted.setStudentEmail(next.getStudentEmail());
            promoted.setStudentUsername(next.getStudentUsername());
            promoted.setCourseCode(courseCode);
            enrollmentRepository.save(promoted);

            if (course != null) {
                course.setEnrolled((course.getEnrolled() == null ? 0 : course.getEnrolled()) + 1);
                courseRepository.save(course);
            }
        }

        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/waitlist")
    public List<Map<String, Object>> getWaitlist() {
        List<Map<String, Object>> result = new ArrayList<>();
        List<WaitlistEntry> items = waitlistRepository.findAll();
        int position = 1;
        for (WaitlistEntry item : items) {
            Map<String, Object> row = new HashMap<>();
            row.put("id", item.getId());
            row.put("studentEmail", item.getStudentEmail());
            row.put("studentUsername", item.getStudentUsername());
            row.put("courseCode", item.getCourseCode());
            row.put("position", position++);
            result.add(row);
        }
        return result;
    }

    @PostMapping("/waitlist")
    public ResponseEntity<?> addWaitlist(@RequestBody Map<String, Object> body) {
        WaitlistEntry waitlist = new WaitlistEntry();
        waitlist.setStudentEmail(String.valueOf(body.get("studentEmail")));
        waitlist.setStudentUsername(String.valueOf(body.get("studentUsername")));
        waitlist.setCourseCode(String.valueOf(body.get("courseCode")).trim().toUpperCase());
        waitlistRepository.save(waitlist);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
