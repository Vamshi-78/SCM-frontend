# 🔧 BACKEND REQUIREMENTS - Spring Boot Must Implement

**Frontend is now fixed to force ALL operations to backend. Backend must have these endpoints working.**

---

## ✅ DATABASE SCHEMA (MySQL - Already Have)

Your MySQL already has correct tables:
- `users` - student accounts
- `course` - courses
- `enrollment` - student enrollments  
- `waitlist` - course waitlist
- `registration_request` - approval workflow
- `notification` - all notifications
- `support_tickets` - student support issues (NEW - may need to create)

---

## 🔴 BACKEND ENDPOINTS THAT MUST WORK

### 1️⃣ **AUTH ENDPOINTS** (Existing - Verify Working)

```
POST /auth/register
  Body: { username, email, password, role: "student" }
  Response: { user, token }
  Database: Save to `users` table

POST /auth/login/student
  Body: { email, password }
  Response: { token, user, registrationApproved }
  Check: `registration_request` table for approval status

POST /auth/login/admin
  Body: { email, password }
  Response: { token, user, role: "admin" }
```

**ISSUE:** Verify token is returned and stored in localStorage correctly.

---

### 2️⃣ **COURSE ENDPOINTS** (May Have Issues)

```
GET /courses
  Response: Array of all courses from `course` table
  Fields: { code, name, day, time, credits, capacity, enrolled }
  ⚠️ ISSUE: Backend may not return `day`, `time` columns

POST /courses (Admin only)
  Body: { code, name, day, time, credits, capacity, prerequisites }
  Action: INSERT into `course` table
  Response: { success, courseId }

PUT /courses/:code (Admin only)
  Body: { name, day, time, credits, capacity, prerequisites }
  Action: UPDATE `course` table
  Response: { success }

DELETE /courses/:code (Admin only)
  Action: DELETE from `course` table
  Response: { success }
```

**TODO FOR BACKEND:**
- Ensure `course` table has `day` and `time` columns
- Return all fields when GET /courses

---

### 3️⃣ **ENROLLMENT ENDPOINTS** (Critical - Likely Missing)

```
GET /enrollments/:email
  Response: Array of enrollments for student
  Fields: { studentEmail, studentUsername, course: { code, name, day, time, credits, capacity, enrolled } }
  Action: SELECT from `enrollment` table WHERE student_email = :email
  JOIN with `course` table

POST /enroll (Student)
  Body: { studentEmail, studentUsername, courseCode, courseName, credits }
  Action: INSERT into `enrollment` table
  Validation:
    - Check max credits (18) per student
    - Check schedule conflicts
    - Check capacity
    - If full, add to `waitlist` instead
  Response: { success, enrolled: true/false, waitlisted: true/false }

POST /unenroll (Student) - NEW ENDPOINT
  Body: { studentEmail, courseCode }
  Action: DELETE from `enrollment` table
  Then: Check `waitlist` table, get first entry, auto-enroll them
  Response: { success }
```

**TODO FOR BACKEND:**
- Implement GET /enrollments/:email
- Implement POST /enroll with schema validation
- Implement POST /unenroll with auto-enrolling from waitlist

---

### 4️⃣ **WAITLIST ENDPOINTS** (Critical - Likely Missing)

```
GET /waitlist
  Response: Array of all waitlist entries
  Fields: { studentEmail, studentUsername, courseCode, timestamp, position }
  Action: SELECT from `waitlist` table
  NOTE: Calculate `position` based on timestamp order

POST /waitlist (Student)
  Body: { studentEmail, studentUsername, courseCode, courseName }
  Action: INSERT into `waitlist` table
  Response: { success, position: X }

DELETE /waitlist/:studentEmail/:courseCode - NEW ENDPOINT
  Action: DELETE from `waitlist` table
  Response: { success }
```

**TODO FOR BACKEND:**
- The `waitlist` table must exist with columns:
  - `id` (auto-increment)
  - `student_email`
  - `student_username`
  - `course_code`
  - `timestamp` (when added)
  - `position` (calculated based on order)

---

### 5️⃣ **NOTIFICATIONS ENDPOINTS** (Critical - Likely Missing)

```
GET /notifications/:userId
  Response: Array of notifications for user
  Fields: { id, userId, userType, type, title, message, timestamp, read }

POST /notifications (Any authenticated user)
  Body: { userId, userType: "student"|"admin", type, title, message }
  Action: INSERT into `notification` table
  Response: { success, notificationId }
  ⚠️ CRITICAL: When student creates support ticket, notification must be auto-created

POST /notifications/:notificationId/read
  Action: UPDATE notification SET read = 1 WHERE id = :notificationId
  Response: { success }

POST /notifications/clear
  Action: DELETE FROM notification WHERE userId = :currentUserId
  Response: { success }
```

**TODO FOR BACKEND:**
- Create `notification` table if not exists:
  - `id` (auto-increment)
  - `user_id` OR `user_email`
  - `user_type` (student/admin/all)
  - `type` (system, enrollment, support, warning, etc.)
  - `title`
  - `message`
  - `timestamp`
  - `is_read` (boolean)

---

### 6️⃣ **REGISTRATION APPROVAL ENDPOINTS** (Existing - Verify)

```
GET /api/admin/registrations
  Response: Array of pending registrations from `registration_request` table
  ⚠️ Check: Field names match frontend expectations (id, username, email, createdAt)

POST /api/admin/registrations/:id/approve
  Action: 
    1. Update `registration_request` SET status = 'APPROVED' WHERE id = :id
    2. Create notification: "Your registration has been approved"
    3. Update user record with approval flag
  Response: { success }

POST /api/admin/registrations/:id/reject
  Action:
    1. Update `registration_request` SET status = 'REJECTED' WHERE id = :id
    2. Create notification: "Your registration has been rejected"
    3. Optionally delete user from `users` table
  Response: { success }
```

**TODO FOR BACKEND:**
- Verify `registration_request` table structure
- Auto-create notification when approved/rejected

---

### 7️⃣ **SUPPORT TICKETS ENDPOINTS** (NEW - Must Create)

```
GET /support-tickets/:studentEmail
  Response: Array of support tickets for student
  Fields: { id, studentEmail, studentUsername, subject, description, category, status, priority, createdAt, responses: [] }
  Action: SELECT from `support_tickets` table WHERE student_email = :studentEmail
  LEFT JOIN with `support_responses` table

POST /support-tickets (Student - create new ticket)
  Body: { studentEmail, studentUsername, subject, description, category, priority }
  Action: INSERT into `support_tickets` table
  Then: Auto-create notification "Support ticket created"
  Response: { success, ticketId }

POST /support-tickets/:ticketId/respond (Admin - reply to ticket)
  Body: { by, role, message }
  Action: INSERT into `support_responses` table (or nested array)
  Then: Auto-create notification "New response on ticket #X"
  Response: { success }

POST /support-tickets/:ticketId/status (Admin - change status)
  Body: { status: "Open"|"In Progress"|"Resolved"|"Closed" }
  Action: UPDATE `support_tickets` SET status = :status WHERE id = :ticketId
  Response: { success }
```

**TODO FOR BACKEND:**
- Create `support_tickets` table:
  - `id` (auto-increment)
  - `student_email`
  - `student_username`
  - `subject`
  - `description`
  - `category` (Enrollment Issue, Technical Problem, Course Information, Other)
  - `status` (Open, In Progress, Resolved, Closed)
  - `priority` (Low, Medium, High)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

- Create `support_responses` table:
  - `id` (auto-increment)
  - `ticket_id`
  - `response_by` (admin username or student username)
  - `response_role` (admin/student)
  - `message`
  - `created_at` (timestamp)

---

## 🔴 CRITICAL ISSUES TO FIX

### Issue 1: Registration Requests Not Showing in Database
**Symptom:** Frontend shows admin registration page but no data
**Solution:**
```sql
-- Check if data is in registration_request table
SELECT * FROM scm_db.registration_request;

-- If not populated, create endpoint that:
-- 1. On student signup, insert into registration_request
-- 2. Set status = 'PENDING'
-- 3. Return data when admin calls GET /api/admin/registrations
```

### Issue 2: Waitlist Not Showing in Database
**Symptom:** Students can join waitlist but table is empty
**Solution:**
```sql
-- Verify table exists
DESCRIBE scm_db.waitlist;

-- If exists, backend POST /waitlist must actually INSERT
-- If not exists, create:
CREATE TABLE scm_db.waitlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  student_email VARCHAR(255),
  student_username VARCHAR(100),
  course_code VARCHAR(50),
  position INT,
  FOREIGN KEY (course_code) REFERENCES course(code)
);
```

### Issue 3: Updates Not Saving to Database
**Symptom:** Admin edits a course but no changes in DB
**Solution:**
- Verify PUT /courses/:code endpoint is actually calling UPDATE query
- Add logging: `console.log("Updating course:", code, data);`
- Check if JWT token validation is blocking the request

### Issue 4: Notifications Not Showing in Database
**Symptom:** No entries in notification table
**Solution:**
```sql
-- Check table
SELECT * FROM scm_db.notification;

-- If empty, backend must:
-- 1. Call POST /notifications from frontend
-- 2. Actually INSERT into notification table
-- 3. Auto-send notifications on key events:
--    - When student enrolls
--    - When registration approved/rejected
--    - When support ticket created
--    - When support response added
```

---

## 📋 BACKEND CHECKLIST

**Before running frontend, backend MUST have:**

- [ ] POST /auth/register - registers student
- [ ] POST /auth/login/student - returns JWT token
- [ ] POST /auth/login/admin - returns JWT token with admin role
- [ ] GET /courses - returns all courses with day, time fields
- [ ] POST /courses - adds new course
- [ ] PUT /courses/:code - updates course
- [ ] DELETE /courses/:code - deletes course
- [ ] GET /enrollments/:email - returns student's enrollments
- [ ] POST /enroll - enrolls student in course (checks conflicts, credits, capacity)
- [ ] POST /unenroll - removes enrollment, auto-enrolls from waitlist
- [ ] GET /waitlist - returns all waitlist entries
- [ ] POST /waitlist - adds to waitlist
- [ ] GET /notifications/:userId - returns user's notifications
- [ ] POST /notifications - creates new notification (saved to DB)
- [ ] POST /notifications/:id/read - marks notification as read
- [ ] POST /notifications/clear - clears all notifications
- [ ] GET /api/admin/registrations - returns pending registrations
- [ ] POST /api/admin/registrations/:id/approve - approves registration
- [ ] POST /api/admin/registrations/:id/reject - rejects registration
- [ ] GET /support-tickets/:email - returns user's tickets
- [ ] POST /support-tickets - creates new ticket
- [ ] POST /support-tickets/:id/respond - adds response to ticket
- [ ] POST /support-tickets/:id/status - changes ticket status
- [ ] CORS configured to allow requests from localhost:5173

---

## 🚀 HOW TO TEST BACKEND CONNECTION

1. **Start Backend:**
   ```bash
   java -jar your-app.jar
   ```
   Should run on `http://localhost:8080`

2. **Check if online:**
   ```bash
   curl http://localhost:8080/courses
   ```
   Should get JSON response (not 404, not Connection Refused)

3. **Check CORS:**
   ```bash
   curl -H "Origin: http://localhost:5173" http://localhost:8080/courses
   ```
   Should include `Access-Control-Allow-Origin` header

4. **Run Frontend:**
   ```bash
   npm run dev
   ```
   Opens `http://localhost:5173`

5. **Try Login:**
   - Open DevTools (F12) → Network tab
   - Try to login
   - Should see POST request to `http://localhost:8080/auth/login/student`
   - If request fails, check backend logs for errors

---

## 🎯 EXPECTED BEHAVIOR AFTER FIXES

✅ Login → Token saved to localStorage
✅ View Courses → Data fetched from DB
✅ Enroll in Course → Entry added to `enrollment` table
✅ Join Waitlist → Entry added to `waitlist` table
✅ Create Support Ticket → Entry added to `support_tickets` table + Notification created
✅ Admin Approves Student → Status updated in `registration_request` + Notification sent
✅ Edit Course → `course` table updated
✅ All data persists even after page refresh (comes from backend, not localStorage)

---

## 📝 NOTES

- **Frontend is now strict:** If backend returns error, frontend will show it clearly
- **No more silent failures:** Every API error will appear as an alert
- **localStorage is only for user session:** Not for real data anymore
- **All CRUD operations now go to backend:** No more local-only fallback
