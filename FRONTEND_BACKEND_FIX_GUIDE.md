# 🚀 FRONTEND + BACKEND CONNECTION - QUICK FIX GUIDE

---

## 📌 WHAT I JUST FIXED IN FRONTEND

✅ **Removed all localStorage fallbacks** - No more "Backend not connected" messages
✅ **Force ALL operations to hit backend** - Every action now requires backend success
✅ **Added proper error handling** - Backend errors now show clearly to user
✅ **Updated API file** - Added missing notification and support ticket endpoints
✅ **Fixed data fetching** - Enrollments, waitlist, courses now fetch from backend on load

**Result:** Your app will now FAIL clearly if backend is not working, instead of silently saving locally.

---

## 🔧 WHAT YOUR BACKEND NEEDS RIGHT NOW

### **Database Tables** (Check if these exist in scm_db)

```sql
-- Run this to verify tables exist:
SHOW TABLES IN scm_db;
```

**Must have:**
- `users` - Student/admin accounts
- `course` - Course catalog
- `enrollment` - Student enrollments
- `waitlist` - Waitlist entries
- `registration_request` - Admin approvals
- `notification` - All notifications

**Check:** Does `notification` table have a `user_id` or `user_email` column? If not, add:
```sql
ALTER TABLE scm_db.notification ADD COLUMN user_email VARCHAR(255);
```

**NEW TABLE NEEDED:** Support Tickets (if doesn't exist)
```sql
CREATE TABLE scm_db.support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_email VARCHAR(255),
  student_username VARCHAR(100),
  subject VARCHAR(255),
  description LONGTEXT,
  category VARCHAR(100),
  status VARCHAR(50),
  priority VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE scm_db.support_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT,
  response_by VARCHAR(100),
  response_role VARCHAR(50),
  message LONGTEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
);
```

---

## 🟢 MUST-HAVE ENDPOINTS IN SPRING BOOT

### **Auth** (Probably working)
```
POST /auth/register
POST /auth/login/student
POST /auth/login/admin
```

### **Courses** (May need column fixes)
```
GET /courses                    → Returns: { code, name, day, time, credits, capacity, enrolled }
POST /courses
PUT /courses/:code
DELETE /courses/:code
```
⚠️ **Check:** Does response include `day` and `time` fields? If not, add to Entity.

### **Enrollments** (MISSING - Must Create)
```
GET /enrollments/:email         → Returns array of user's enrollments
POST /enroll                    → Create enrollment (check capacity, credits, conflicts)
POST /unenroll                  → Remove enrollment + auto-enroll from waitlist
```

### **Waitlist** (MISSING - Must Create)
```
GET /waitlist                   → Returns all waitlist entries
POST /waitlist                  → Add to waitlist
```

### **Notifications** (MISSING - Must Create)
```
GET /notifications/:userId      → Returns user's notifications
POST /notifications             → Create notification (MUST save to DB!)
POST /notifications/:id/read    → Mark as read
POST /notifications/clear       → Delete all user's notifications
```

### **Support Tickets** (MISSING - Must Create)
```
GET /support-tickets/:email     → User's tickets
POST /support-tickets           → Create new ticket + auto-send notification
POST /support-tickets/:id/respond
POST /support-tickets/:id/status
```

### **Admin Registration** (Probably working)
```
GET /api/admin/registrations
POST /api/admin/registrations/:id/approve   → Must create notification!
POST /api/admin/registrations/:id/reject    → Must create notification!
```

---

## ⚡ QUICK TEST

### **Test 1: Backend Running?**
```bash
curl http://localhost:8080/courses
```
✅ Should return JSON with courses, NOT error

### **Test 2: Token System?**
```bash
# Login first to get token
curl -X POST http://localhost:8080/auth/login/student \
  -H "Content-Type: application/json" \
  -d '{"email":"student@gmail.com","password":"123"}'
```
✅ Should return `token` in response

### **Test 3: CORS?**
Check browser DevTools → Network tab → See if requests get `Access-Control-Allow-Origin` header

---

## 🛠️ STEP-BY-STEP TO MAKE IT WORK

### **Step 1: Fix Course Endpoint**
Make sure GET `/courses` returns:
```json
{
  "code": "24SP2101",
  "name": "ATHLETICS",
  "day": "Mon",
  "time": "9AM",
  "credits": 2,
  "capacity": 30,
  "enrolled": 5
}
```

**Issue:** If `day` and `time` are NULL, add these columns to `course` table:
```sql
ALTER TABLE scm_db.course ADD COLUMN day VARCHAR(50);
ALTER TABLE scm_db.course ADD COLUMN time VARCHAR(50);
```

---

### **Step 2: Create Enrollment Endpoints**
Add these Spring Boot endpoints:

**GET /enrollments/{email}**
```sql
SELECT e.*, c.* FROM scm_db.enrollment e
JOIN scm_db.course c ON e.course_code = c.code
WHERE e.student_email = :email;
```

**POST /enroll**
```
1. Check if student exists in users table
2. Check if course exists
3. Check if already enrolled → Reject if yes
4. Check total credits ≤ 18 → Reject if over
5. Check schedule conflicts → Reject if conflict
6. Check if course full:
   - If not full → INSERT into enrollment table
   - If full → INSERT into waitlist table instead
7. Create notification for student
```

**POST /unenroll**
```
1. DELETE from enrollment
2. SELECT first entry from waitlist
3. If exists → INSERT into enrollment (auto-promote)
```

---

### **Step 3: Create Notification Endpoints**
**CRITICAL:** When any event happens, auto-create notification:

```java
// When student enrolls
api.notificationService.create(new Notification(
  userId = studentEmail,
  type = "enrollment",
  message = "Successfully enrolled in COURSE_NAME"
));

// When support ticket created
api.notificationService.create(new Notification(
  userId = studentEmail,
  type = "support",
  message = "Support ticket #X has been created"
));

// When admin approves
api.notificationService.create(new Notification(
  userId = studentEmail,
  type = "registration",
  message = "Your registration has been approved!"
));
```

---

### **Step 4: Test in Frontend**

1. **Start backend:**
   ```bash
   java -jar YourApp.jar
   ```
   (Or run from IDE)

2. **Start frontend:**
   ```bash
   cd "d:\online platform"
   npm run dev
   ```

3. **Try login:**
   - Username: `purnachandh` (or your student username)
   - Email: `purnachandh@example.com`
   - Password: `123` (or whatever you set)

4. **Check DevTools:**
   - Press F12 → Network tab
   - Try to enroll in a course
   - Should see POST request to `http://localhost:8080/enroll`
   - Response should be `{ success: true }`
   - Database should show new entry in `enrollment` table

---

## ❌ EXPECTED ERRORS & FIXES

### **Error: "Failed to load courses. Check backend connection"**
**Cause:** GET /courses failing
**Fix:** 
- Is backend running on port 8080?
- Are all course columns present (day, time)?
- Test: `curl http://localhost:8080/courses`

### **Error: "Enrollment failed: ..."**
**Cause:** POST /enroll endpoint or validation failing
**Fix:**
- Add detailed logging in POST /enroll endpoint
- Check: Is student email in users table?
- Check: Does course code match database?
- Check: Is JWT token valid?

### **Error: "Failed to fetch enrollments from backend"**
**Cause:** GET /enrollments/:email endpoint not found or failing
**Fix:**
- Implementation: Create GET /enrollments/{email}
- Test: `curl http://localhost:8080/enrollments/purnachandh@example.com`

### **Error: "Failed to fetch waitlist from backend"**
**Cause:** GET /waitlist endpoint not found
**Fix:**
- Implementation: Create GET /waitlist endpoint
- Test: `curl http://localhost:8080/waitlist`

### **Data still not appearing in MySQL**
**Root Causes:**
1. Backend catching exceptions silently (add proper logging)
2. Transactions not committed (check @Transactional annotations)
3. Wrong table/column names
4. Token validation failing (check JWT filter)

**Debug:** Add logging in each endpoint:
```java
@PostMapping("/enroll")
public ResponseEntity<?> enrollStudent(@RequestBody EnrollmentDTO dto) {
    System.out.println("📍 POST /enroll called with: " + dto);
    try {
        // Insert code here
        System.out.println("✅ Enrollment created");
        return ResponseEntity.ok("Success");
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}
```

---

## ✅ SUCCESS CHECKLIST

**Frontend + Backend working when:**

- ✅ Login works → token saved
- ✅ Courses load → from database
- ✅ Enroll → entry in `enrollment` table
- ✅ View enrollment → shows in student's enrollment list
- ✅ Join waitlist → entry in `waitlist` table
- ✅ Create support ticket → entry in `support_tickets` table
- ✅ Notification appears → entry in `notification` table when event happens
- ✅ Admin approves student → registration_request updated
- ✅ Edit course → `course` table updated
- ✅ Data persists after page refresh (not localStorage)

---

## 📞 IF STILL NOT WORKING

**Provide this info:**

1. Is backend running? (Check: `curl http://localhost:8080/courses`)
2. Any database errors in backend logs?
3. DevTools → Network tab → Show request/response for failed endpoint
4. Database output: `SELECT * FROM scm_db.enrollment LIMIT 5;`
5. Which specific action fails? (enroll/waitlist/update/notification)

---

## 🎯 THE MAIN ISSUE (Why data wasn't saving before)

**Old Code:**
```javascript
try {
  await api.enroll(...);
  // If error → catch block shows "Backend not connected"
  // But still updates localStorage ❌
} catch {
  alert("Backend not connected");
  // Still saved to localStorage! ❌
}
```

**New Code:**
```javascript
try {
  await api.enroll(...);  // Must succeed
  // Only continue if backend returns success
  console.log("✅ Saved to database");
} catch {
  alert("❌ Failed: " + error.message);  // Shows real error
  throw error;  // Stops execution
  // NO localStorage fallback ✅
}
```

**Result:** If backend is not working, you'll know immediately instead of silently saving to localStorage.
