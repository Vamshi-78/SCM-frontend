# Waitlist Management Feature Guide

## Overview
The waitlist feature allows students to join a queue when a course is full, and admins to review and approve/reject these requests.

---

## For Students

### How to Join a Waitlist
1. Go to **Enroll Courses** page
2. If a course is full, you'll see a **⏳ Join Waitlist** button instead of "Enroll Now"
3. Click the button to add yourself to the waitlist
4. You'll receive a notification confirming you're on the waitlist

### Viewing Your Waitlist Status
1. Go to your **Student Dashboard**
2. Check the **Waitlisted** card to see how many courses you're waiting for
3. Scroll down to see detailed waitlist information including your position

### Notifications
- You'll receive a notification when you join a waitlist
- You'll receive a notification if your request is approved or rejected by admin
- You'll be auto-enrolled if a seat opens up (someone unenrolls)

---

## For Admins

### Accessing Waitlist Management
1. Log in as admin
2. Click **Waitlist** in the sidebar, or
3. Click the **Waitlist Count** card on the Admin Dashboard

### Reviewing Waitlist Requests

#### Waitlist Table Features
- **Position**: Shows the student's place in the queue
- **Student Info**: Name and email
- **Course Details**: Code, name, day, time
- **Enrolled/Capacity**: Current enrollment vs. max capacity
- **Available Seats**: How many seats are left
- **Override Conflict**: Checkbox to allow enrollment even if schedule conflict exists
- **Actions**: Approve or Reject buttons

#### Approving a Waitlist Entry
1. Find the student in the waitlist table
2. Check if seats are available (Available Seats > 0)
3. If no seats: Click **+ Add Seats** to increase capacity
4. If there's a schedule conflict warning, check **Override Conflict** to allow it
5. Click **✅ Approve**
6. Student will be enrolled and receive a notification

#### Rejecting a Waitlist Entry
1. Find the student in the waitlist table
2. Click **❌ Reject**
3. Confirm the action
4. Student will be removed from waitlist and receive a notification

### Managing Course Capacity

#### From Waitlist Management Page
1. In the **Course Capacity Overview** section at the bottom
2. Find the course you want to edit
3. Click **Edit Capacity**
4. Enter new capacity (must be ≥ current enrollment)
5. Capacity updates immediately

#### From Manage Courses Page
1. Go to **Manage Courses** in the sidebar
2. Each course now has a **Waitlist** column showing waitlist count
3. In the **Capacity** column, click **✏️ Edit** button
4. Enter new capacity in the input field
5. Click **✓** to save or **✕** to cancel
6. System prevents reducing capacity below current enrollment

### Capacity Rules
- ✅ Can increase capacity at any time
- ❌ Cannot reduce capacity below current enrollment count
- ✅ Capacity must be a positive number (1-200)
- ✅ Increasing capacity allows approval of waitlisted students

### Conflict Resolution
**Scenario**: Student has a schedule conflict (same day/time as another enrolled course)

**Options**:
1. **Reject**: Click Reject to deny the request
2. **Override**: Check "Override Conflict" checkbox and then Approve
   - Use this when student has permission for double booking
   - Use for special cases like lab sections

### Filtering Waitlist
- Use the dropdown to filter by specific course
- Shows count per course: e.g., "24CS2202 (3)" means 3 students waiting
- Select "All Courses" to see all waitlist entries

### Waitlist Statistics
Top cards show:
- **Total Waitlist**: Number of waitlist entries across all courses
- **Courses with Waitlist**: How many courses have waiting students
- **Unique Students**: Number of different students on waitlists

---

## Technical Details

### Auto-Enrollment
When a student unenrolls from a full course:
- The first person on the waitlist for that course is **automatically enrolled**
- They receive a notification
- No admin action needed

### Data Tracked
Each waitlist entry includes:
- Student email and username
- Course details
- Timestamp (when they joined)
- Unique ID

### Notifications Sent
- Student joins waitlist → "Added to Waitlist"
- Admin approves → "Waitlist Approved"
- Admin rejects → "Waitlist Rejected"
- Auto-enrolled → "Successfully Enrolled"

---

## Common Workflows

### Workflow 1: Course Becomes Full
1. Student tries to enroll in a full course
2. System adds them to waitlist automatically
3. Student sees waitlist position on their dashboard
4. Admin reviews and approves when seats open

### Workflow 2: Increasing Capacity for Waitlisted Students
1. Admin sees 5 students waiting for a course
2. Admin goes to Waitlist Management
3. Click **+ Add Seats** next to the course
4. Increase capacity from 30 to 35
5. Approve the 5 waitlisted students one by one
6. Students receive approval notifications

### Workflow 3: Handling Conflicts
1. Admin clicks Approve for a student
2. Alert: "⚠ Schedule conflict detected"
3. Admin checks student's situation
4. If allowed: Check "Override Conflict" and Approve again
5. If not allowed: Click Reject

---

## Tips

### For Admins
- Check waitlist regularly during registration period
- Increase capacity proactively if demand is high
- Use Course Capacity Overview to see utilization percentages
- Red highlighting (80%+) indicates high demand courses
- Waitlist column in Manage Courses shows at-a-glance demand

### For Students
- Join waitlist early for better position
- Check notifications regularly
- If you get approved, verify your timetable for conflicts
- You can join waitlist for multiple courses

---

## Troubleshooting

### Can't Approve Student - No Seats Available
**Solution**: Increase course capacity first using Edit Capacity

### Can't Approve - Schedule Conflict
**Solution**: Use Override Conflict checkbox if appropriate

### Can't Reduce Capacity
**Reason**: New capacity is less than current enrollment
**Solution**: Students must unenroll before reducing capacity

### Waitlist Entry Disappeared
**Reason**: Student was auto-enrolled when someone else unenrolled
**Check**: Look in Student Enrollments section on Admin Dashboard

---

## Summary

**Student Flow**:
Course Full → Join Waitlist → Wait for Approval → Get Enrolled (or Rejected)

**Admin Flow**:  
View Waitlist → Check Capacity → Adjust if Needed → Approve/Reject → Student Notified

**Key Feature**: Admins have full control to manage capacity and resolve conflicts while maintaining student experience.
