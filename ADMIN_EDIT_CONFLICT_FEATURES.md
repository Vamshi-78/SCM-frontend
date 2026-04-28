# Admin Features: Edit Course & Conflict Resolution

## 🎯 Overview
Added two powerful admin features for course management and conflict resolution.

---

## ✏️ Feature 1: Edit Course

### What Admins Can Edit:
- ✏️ **Course Name** - Change the course title
- 📅 **Day** - Move to different day (Mon-Fri)
- ⏰ **Time** - Change time slot (9AM - 4PM)
- 🎯 **Credits** - Adjust credit value (1-5)
- 👥 **Capacity** - Increase or decrease max seats
- 📋 **Prerequisites** - Modify prerequisite courses

### How to Use:
1. Go to **Manage Courses** page
2. Find the course you want to edit
3. Click **✏️ Edit Course** button
4. The row transforms into an edit form with all fields
5. Make your changes
6. Click **✓ Save** to apply or **✕ Cancel** to discard

### Edit Mode Features:
- **Inline editing** - Edit directly in the table
- **Validation** - Cannot reduce capacity below current enrollment
- **Real-time updates** - Changes apply immediately to:
  - Course catalog
  - Existing enrollments
  - Waitlist entries
- **Prerequisites** - Enter as comma-separated (e.g., "CS101, MT202")

### Safeguards:
- ❌ Cannot reduce capacity below enrolled students
- ✅ All fields are validated before saving
- ✅ Students' enrollment records update automatically
- ✅ Waitlist entries reflect course changes

### Example Use Cases:
- **Room change** → Update time slot
- **Increased demand** → Increase capacity
- **Faculty change** → Update course name/details
- **Curriculum update** → Change prerequisites
- **Schedule optimization** → Move to different day/time

---

## ⚠️ Feature 2: Conflict Resolution

### What It Does:
Automatically detects when students are enrolled in multiple courses with the same day and time, allowing admins to resolve these conflicts.

### Accessing Conflict Resolution:
1. Click **Resolve Conflicts** in admin sidebar
2. Or navigate to `/conflict-resolution`

### Dashboard Shows:
- **Total Conflicts** - Number of schedule conflicts detected
- **Students Affected** - How many students have conflicts
- **Filter by Student** - Focus on specific student's conflicts

### Conflict Display:
Each conflict shows:
- 👤 **Student Info** - Name and email
- **Course 1** - Code, name, day, time
- ⚠️ **CONFLICT** - Clear indicator
- **Course 2** - Second conflicting course
- **Resolution Options** - Suggested actions

### How to Resolve:

#### Option 1: Remove a Course
1. Review both conflicting courses
2. Click **Remove This** button on the course to drop
3. Confirm the action
4. Student is automatically notified
5. Waitlist processes automatically (next student enrolled if any)

#### Option 2: Edit Course Time
1. Go to **Manage Courses**
2. Use **Edit Course** feature
3. Change day or time of one course
4. Conflict automatically resolves

#### Option 3: Contact Student
1. Note student's email from conflict display
2. Contact them to choose which course to keep
3. Remove the unwanted course

### Resolution Actions:
- **Force Unenroll** - Admin can remove any student from any course
- **Auto-notification** - Student receives notification about unenrollment
- **Waitlist processing** - If course was full, next waitlisted student is enrolled
- **Real-time updates** - Conflict list updates after resolution

### Conflict Detection:
The system automatically finds conflicts by:
1. Grouping all enrollments by student
2. Checking for same day + same time within each student's schedule
3. Displaying all matches

### When Conflicts Occur:
- **Course edits** - Admin changes time after students enrolled
- **Waitlist overrides** - Admin approves with "Override Conflict" checked
- **System bypass** - Manual enrollment adjustments

### Prevention Tips:
- Regular monitoring during registration period
- Check conflicts before editing course schedules
- Use "Override Conflict" carefully in waitlist approvals
- Review conflicts page weekly

---

## 🔗 Integration

Both features work together:
1. **Edit Course** can create conflicts if time changes
2. **Conflict Resolution** shows those conflicts
3. Admin can resolve by:
   - Reverting the edit
   - Removing students from one course
   - Moving course to different time

---

## 📍 Navigation

### Sidebar Links (Admin):
- Dashboard
- Manage Courses ← **Edit Course** feature here
- Waitlist
- **Resolve Conflicts** ← **NEW**
- Support Tickets
- Notifications
- Profile

### Page URLs:
- Edit Course: `/manage-courses`
- Resolve Conflicts: `/conflict-resolution`

---

## 🛡️ Permissions

Both features are **admin-only**:
- Students cannot edit courses
- Students cannot force unenroll others
- Protected routes ensure only admins access

---

## 🔧 Technical Details

### AuthContext Functions Added:
```javascript
updateCourse(courseCode, updatedFields)
- Updates course and all related enrollments/waitlist

adminForceUnenroll(studentEmail, courseCode)
- Admin override to remove any student from any course
- Processes waitlist automatically
- Sends notifications
```

### Data Synchronization:
When a course is edited:
1. Main course record updates
2. All enrollment records update
3. All waitlist entries update
4. Students see changes immediately in their dashboard

---

## 📊 Example Scenarios

### Scenario 1: Increase Course Capacity
1. Go to Manage Courses
2. Click **✏️ Edit Course**
3. Change capacity from 30 to 40
4. Click **✓ Save**
5. Result: 10 more seats available for enrollment

### Scenario 2: Resolve Time Conflict
1. Go to Resolve Conflicts
2. See: Student A has conflict - CS101 (Mon 9AM) and MT202 (Mon 9AM)
3. Click **Remove This** on MT202
4. Confirm action
5. Result: Conflict resolved, student notified, next waitlisted student enrolled in MT202

### Scenario 3: Change Course Time
1. Go to Manage Courses
2. Find CS101 with Mon 9AM
3. Click **✏️ Edit Course**
4. Change time to "10AM"
5. Click **✓ Save**
6. Result: All students with CS101 now show Mon 10AM in their schedule

---

## 📝 Summary

**Edit Course Feature**:
- Full inline editing of all course attributes
- Real-time synchronization across all records
- Validation to prevent data integrity issues

**Conflict Resolution**:
- Automatic conflict detection
- Visual conflict display with clear indicators
- One-click resolution with force unenroll
- Automatic notifications and waitlist processing

Both features maintain data integrity and provide a seamless admin experience! 🎉
