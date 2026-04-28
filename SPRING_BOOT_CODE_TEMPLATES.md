# 💻 SPRING BOOT CODE TEMPLATES - Copy & Paste Ready

---

## 📋 DATABASE SETUP

### Run these SQL commands in MySQL:

```sql
-- 1. Create Support Tickets Table
CREATE TABLE scm_db.support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_email VARCHAR(255) NOT NULL,
  student_username VARCHAR(100),
  subject VARCHAR(255),
  description LONGTEXT,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Open',
  priority VARCHAR(50) DEFAULT 'Medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_email) REFERENCES users(email)
);

-- 2. Create Support Responses Table
CREATE TABLE scm_db.support_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  response_by VARCHAR(100),
  response_role VARCHAR(50),
  message LONGTEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);

-- 3. Add day/time columns to course if not exists
ALTER TABLE scm_db.course ADD COLUMN day VARCHAR(50) DEFAULT 'TBA';
ALTER TABLE scm_db.course ADD COLUMN time VARCHAR(50) DEFAULT 'TBA';

-- 4. Verify notification table has user_email
ALTER TABLE scm_db.notification ADD COLUMN user_email VARCHAR(255);
ALTER TABLE scm_db.notification ADD COLUMN user_type VARCHAR(50) DEFAULT 'student';

-- 5. Verify enrollment table has all columns needed
-- Should have: id, student_email, student_username, course_code, enrolled_date
DESC scm_db.enrollment;

-- 6. Verify waitlist table
-- Should have: id, timestamp, student_email, student_username, course_code
DESC scm_db.waitlist;
```

---

## 🔧 SPRING BOOT ENTITIES & DTOs

### **1. Create Support Ticket Entity**

```java
package com.yourcompany.entitys;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "student_email")
    private String studentEmail;
    
    @Column(name = "student_username")
    private String studentUsername;
    
    @Column(name = "subject")
    private String subject;
    
    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "priority")
    private String priority;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "ticket_id")
    private List<SupportResponse> responses;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    
    public String getStudentUsername() { return studentUsername; }
    public void setStudentUsername(String studentUsername) { this.studentUsername = studentUsername; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<SupportResponse> getResponses() { return responses; }
    public void setResponses(List<SupportResponse> responses) { this.responses = responses; }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = "Open";
        if (this.priority == null) this.priority = "Medium";
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
```

### **2. Support Response Entity**

```java
package com.yourcompany.entitys;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_responses")
public class SupportResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "ticket_id")
    private Integer ticketId;
    
    @Column(name = "response_by")
    private String responseBy;
    
    @Column(name = "response_role")
    private String responseRole;
    
    @Column(name = "message", columnDefinition = "LONGTEXT")
    private String message;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getTicketId() { return ticketId; }
    public void setTicketId(Integer ticketId) { this.ticketId = ticketId; }
    
    public String getResponseBy() { return responseBy; }
    public void setResponseBy(String responseBy) { this.responseBy = responseBy; }
    
    public String getResponseRole() { return responseRole; }
    public void setResponseRole(String responseRole) { this.responseRole = responseRole; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
```

### **3. DTOs**

```java
package com.yourcompany.dto;

public class CreateTicketDTO {
    public String studentEmail;
    public String studentUsername;
    public String subject;
    public String description;
    public String category;
    public String priority;
}

public class RespondToTicketDTO {
    public String by;
    public String role;
    public String message;
}

public class UpdateTicketStatusDTO {
    public String status;
}

public class NotificationDTO {
    public String userId;
    public String userType;
    public String type;
    public String title;
    public String message;
}

public class EnrollmentDTO {
    public String studentEmail;
    public String studentUsername;
    public String courseCode;
    public String courseName;
    public Integer credits;
}
```

---

## 🎯 SPRING BOOT REPOSITORIES

### **Repository Interfaces**

```java
package com.yourcompany.repositories;

import com.yourcompany.entitys.SupportTicket;
import com.yourcompany.entitys.Notification;
import com.yourcompany.entitys.Enrollment;
import com.yourcompany.entitys.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer> {
    List<SupportTicket> findByStudentEmail(String studentEmail);
    Optional<SupportTicket> findByIdAndStudentEmail(Integer id, String studentEmail);
}

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserEmail(String userEmail);
    List<Notification> findByUserId(String userId);
}

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    List<Enrollment> findByStudentEmail(String studentEmail);
    Optional<Enrollment> findByStudentEmailAndCourseCode(String email, String code);
    Integer countByStudentEmail(String email);
}

@Repository
public interface WaitlistRepository extends JpaRepository<Waitlist, Integer> {
    List<Waitlist> findByCourseCode(String courseCode);
    List<Waitlist> findByStudentEmail(String studentEmail);
    Optional<Waitlist> findByStudentEmailAndCourseCode(String email, String code);
}
```

---

## 📡 SPRING BOOT CONTROLLERS

### **1. Enrollment Controller** (NEW ENDPOINTS)

```java
package com.yourcompany.controllers;

import com.yourcompany.dto.EnrollmentDTO;
import com.yourcompany.entitys.Enrollment;
import com.yourcompany.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @GetMapping("/enrollments/{email}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getEnrollments(@PathVariable String email) {
        System.out.println("📍 GET /enrollments/" + email);
        try {
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByEmail(email);
            System.out.println("✅ Found " + enrollments.size() + " enrollments");
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/enroll")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> enrollStudent(@RequestBody EnrollmentDTO dto) {
        System.out.println("📍 POST /enroll - " + dto.studentEmail + " in " + dto.courseCode);
        try {
            Enrollment enrollment = enrollmentService.enrollStudent(dto);
            System.out.println("✅ Enrollment created: " + enrollment.getId());
            return ResponseEntity.ok(Map.of("success", true, "enrollmentId", enrollment.getId()));
        } catch (Exception e) {
            System.err.println("❌ Enrollment failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/unenroll")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> unenrollStudent(@RequestBody Map<String, String> request) {
        System.out.println("📍 POST /unenroll - " + request.get("studentEmail"));
        try {
            enrollmentService.unenrollStudent(request.get("studentEmail"), request.get("courseCode"));
            System.out.println("✅ Unenrollment successful");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            System.err.println("❌ Unenroll failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
```

### **2. Support Ticket Controller** (NEW)

```java
package com.yourcompany.controllers;

import com.yourcompany.dto.CreateTicketDTO;
import com.yourcompany.dto.RespondToTicketDTO;
import com.yourcompany.dto.UpdateTicketStatusDTO;
import com.yourcompany.entitys.SupportTicket;
import com.yourcompany.service.SupportTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/support-tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SupportTicketController {
    
    @Autowired
    private SupportTicketService ticketService;
    
    @GetMapping("/{email}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTickets(@PathVariable String email) {
        System.out.println("📍 GET /support-tickets/" + email);
        try {
            List<SupportTicket> tickets = ticketService.getTicketsByEmail(email);
            System.out.println("✅ Found " + tickets.size() + " tickets");
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createTicket(@RequestBody CreateTicketDTO dto) {
        System.out.println("📍 POST /support-tickets - " + dto.studentEmail);
        try {
            SupportTicket ticket = ticketService.createTicket(dto);
            System.out.println("✅ Ticket created: #" + ticket.getId());
            return ResponseEntity.ok(Map.of("success", true, "ticketId", ticket.getId()));
        } catch (Exception e) {
            System.err.println("❌ Error creating ticket: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/respond")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> respondToTicket(
            @PathVariable Integer id,
            @RequestBody RespondToTicketDTO dto) {
        System.out.println("📍 POST /support-tickets/" + id + "/respond");
        try {
            ticketService.addResponse(id, dto);
            System.out.println("✅ Response added");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestBody UpdateTicketStatusDTO dto) {
        System.out.println("📍 POST /support-tickets/" + id + "/status -> " + dto.status);
        try {
            ticketService.updateStatus(id, dto.status);
            System.out.println("✅ Status updated");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
```

### **3. Notification Controller** (NEW ENDPOINTS)

```java
package com.yourcompany.controllers;

import com.yourcompany.dto.NotificationDTO;
import com.yourcompany.entitys.Notification;
import com.yourcompany.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getNotifications(@PathVariable String userId) {
        System.out.println("📍 GET /notifications/" + userId);
        try {
            List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
            System.out.println("✅ Found " + notifications.size() + " notifications");
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createNotification(@RequestBody NotificationDTO dto) {
        System.out.println("📍 POST /notifications - " + dto.title);
        try {
            Notification notification = notificationService.createNotification(dto);
            System.out.println("✅ Notification created: #" + notification.getId());
            return ResponseEntity.ok(Map.of("success", true, "notificationId", notification.getId()));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {
        System.out.println("📍 POST /notifications/" + id + "/read");
        try {
            notificationService.markAsRead(id);
            System.out.println("✅ Marked as read");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/clear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> clearNotifications() {
        System.out.println("📍 POST /notifications/clear");
        try {
            notificationService.clearAllNotifications();
            System.out.println("✅ All notifications cleared");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
```

---

## 🛠️ SERVICE LAYER (BUSINESS LOGIC)

### **EnrollmentService**

```java
package com.yourcompany.service;

import com.yourcompany.dto.EnrollmentDTO;
import com.yourcompany.entitys.*;
import com.yourcompany.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private WaitlistRepository waitlistRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public List<Enrollment> getEnrollmentsByEmail(String email) {
        return enrollmentRepository.findByStudentEmail(email);
    }
    
    @Transactional
    public Enrollment enrollStudent(EnrollmentDTO dto) throws Exception {
        // Validation 1: Check if student already enrolled
        Optional<Enrollment> existing = enrollmentRepository
            .findByStudentEmailAndCourseCode(dto.studentEmail, dto.courseCode);
        if (existing.isPresent()) {
            throw new Exception("Already enrolled in this course");
        }
        
        // Validation 2: Check course capacity
        Course course = courseRepository.findById(dto.courseCode)
            .orElseThrow(() -> new Exception("Course not found"));
        
        long enrolled = enrollmentRepository.countByStudentEmail(dto.studentEmail);
        if (enrolled >= 18) {
            throw new Exception("Maximum course limit reached");
        }
        
        // Validation 3: Check if course is full
        long courseEnrollment = enrollmentRepository.countEntitiesByCourseCode(dto.courseCode);
        if (courseEnrollment >= course.getCapacity()) {
            // Add to waitlist instead
            Waitlist waitlistEntry = new Waitlist();
            waitlistEntry.setStudentEmail(dto.studentEmail);
            waitlistEntry.setStudentUsername(dto.studentUsername);
            waitlistEntry.setCourseCode(dto.courseCode);
            waitlistRepository.save(waitlistEntry);
            
            notificationService.createNotification(new NotificationDTO() {{
                userId = dto.studentEmail;
                type = "waitlist";
                title = "Added to Waitlist";
                message = "Course is full. You have been added to the waitlist.";
            }});
            
            throw new Exception("Course is full. Added to waitlist.");
        }
        
        // Create enrollment
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentEmail(dto.studentEmail);
        enrollment.setStudentUsername(dto.studentUsername);
        enrollment.setCourseCode(dto.courseCode);
        
        Enrollment saved = enrollmentRepository.save(enrollment);
        
        // Send notification
        notificationService.createNotification(new NotificationDTO() {{
            userId = dto.studentEmail;
            type = "enrollment";
            title = "Enrollment Successful";
            message = "Successfully enrolled in " + dto.courseName;
        }});
        
        return saved;
    }
    
    @Transactional
    public void unenrollStudent(String email, String courseCode) throws Exception {
        Enrollment enrollment = enrollmentRepository
            .findByStudentEmailAndCourseCode(email, courseCode)
            .orElseThrow(() -> new Exception("Enrollment not found"));
        
        enrollmentRepository.delete(enrollment);
        
        // Check waitlist and auto-promote first person
        List<Waitlist> waitlisted = waitlistRepository.findByCourseCode(courseCode);
        if (!waitlisted.isEmpty()) {
            Waitlist next = waitlisted.get(0);
            
            Enrollment newEnrollment = new Enrollment();
            newEnrollment.setStudentEmail(next.getStudentEmail());
            newEnrollment.setStudentUsername(next.getStudentUsername());
            newEnrollment.setCourseCode(courseCode);
            enrollmentRepository.save(newEnrollment);
            
            waitlistRepository.delete(next);
            
            notificationService.createNotification(new NotificationDTO() {{
                userId = next.getStudentEmail();
                type = "enrollment";
                title = "Promoted from Waitlist";
                message = "A seat has opened. You are now enrolled!";
            }});
        }
    }
}
```

---

## 📝 KEY POINTS

1. **Always add logging** - System.out.println at start and end of each method
2. **Use @Transactional** - Ensures database changes are committed
3. **Auto-create notifications** - When enrolling, unenrolling, approving registration
4. **Handle exceptions** - Return meaningful error messages to frontend
5. **Test each endpoint** - Use Postman or curl before frontend testing

---

## ✅ AFTER IMPLEMENTING

Run these tests:

```bash
# Test 1: Get courses
curl http://localhost:8080/courses

# Test 2: Get enrollments
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/enrollments/student@example.com

# Test 3: Create enrollment
curl -X POST http://localhost:8080/api/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentEmail":"student@example.com","studentUsername":"student","courseCode":"24SP2101"}'

# Test 4: Get support tickets
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/support-tickets/student@example.com
```

✅ All should return 200 OK with data
