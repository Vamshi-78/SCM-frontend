# Student Registration Permission System Documentation

## Overview

The Student Registration Permission System is a new feature that gates access to course enrollment. Students must now request registration approval from administrators before they can browse and enroll in courses.

## Features

### 1. Student Registration Flow
- **Auto-Request on Login**: When a student logs in for the first time, they automatically receive a registration request prompt
- **Request Page**: Students see the `RegistrationRequest.jsx` page with instructions
- **Pending Status**: After requesting, students can see their approval status
- **Notifications**: Students receive notifications when their request is approved or rejected

### 2. Admin Approval Workflow
- **Registration Management Page**: Admins access `/registration-management` to review requests
- **Quick Stats**: Dashboard shows pending, approved, and rejected counts at a glance
- **Approve/Reject**: Admins can approve or reject individual requests
- **Filter View**: Switch between pending, approved, and rejected requests
- **Notifications**: Admins receive notifications for each action

### 3. Access Gating
- **Protected Routes**: Students without approved registration cannot access:
  - `/courses` (course browsing)
  - `/compare-courses` (course comparison)
- **Admin Bypass**: Admins can always access all features
- **Dashboard Access**: All students can view their dashboard and timetable

## Technical Implementation

### AuthContext Updates

New state and functions added:

```javascript
// State
const [registrationRequests, setRegistrationRequests] = useState([]);

// Functions
requestRegistration(studentEmail, studentUsername)
approveRegistrationRequest(studentEmail)
rejectRegistrationRequest(studentEmail)
isRegistrationApproved(studentEmail)
hasRequestedRegistration(studentEmail)
```

### Registration Request State Structure

```javascript
{
  id: 1234567890,
  studentEmail: "john@example.com",
  studentUsername: "john_doe",
  requestDate: "12/15/2024",
  status: "pending" | "approved" | "rejected"
}
```

### New Pages

#### `RegistrationRequest.jsx`
- **Path**: `/registration-request`
- **Access**: Students without registration approval
- **Components**:
  - Request instruction panel
  - Step-by-step guide
  - Request submission button
  - Pending status display
- **Styling**: `src/styles/registration.css`

#### `RegistrationManagement.jsx`
- **Path**: `/registration-management`
- **Access**: Admin only
- **Components**:
  - Statistics cards (pending, approved, rejected counts)
  - Filter buttons for request status
  - Request table with student details
  - Approve/Reject action buttons
- **Styling**: `src/styles/registration-management.css`

### Updated Components

#### `App.jsx`
- Added `EnrollmentGate` wrapper component to check registration status
- Applied gate to `/courses` and `/compare-courses` routes
- Added new routes for registration pages

#### `Login.jsx`
- Auto-calls `requestRegistration()` for first-time students
- Redirects to `/registration-request` if not yet requested
- Redirects to `/student` if already approved

#### `Sidebar.jsx`
- Added "Student Registrations" link for admins
- Links to `/registration-management`

#### `AdminDashboard.jsx`
- Added pending registration count card
- Clickable card navigates to registration management
- Displays real-time pending request count

## User Flows

### Student Flow

1. **First Login**
   ```
   Login Page → Auto-request registration → RegistrationRequest Page
   ```

2. **After Request Submitted**
   ```
   Dashboard → (Wait for approval) → Notification alert
   ```

3. **After Approval**
   ```
   Dashboard → Click "Enroll Courses" → See courses → Enroll
   ```

### Admin Flow

1. **Review Requests**
   ```
   Admin Dashboard → Click "Pending Registrations" card → RegistrationManagement page
   ```

2. **Approve/Reject**
   ```
   View pending requests → Click Approve or Reject button → Notification sent
   ```

## API Endpoints (Context Functions)

### `requestRegistration(studentEmail, studentUsername)`
Submits a registration request for a student.
- **Parameters**: Student email and username
- **Behavior**: 
  - Checks if already requested
  - Creates new request with "pending" status
  - Sends notification to student
  - Triggered automatically on student login

### `approveRegistrationRequest(studentEmail)`
Approves a student's registration request.
- **Parameters**: Student email
- **Behavior**:
  - Sets status to "approved"
  - Sends approval notification
  - Student can now enroll in courses

### `rejectRegistrationRequest(studentEmail)`
Rejects a student's registration request.
- **Parameters**: Student email
- **Behavior**:
  - Sets status to "rejected"
  - Sends rejection notification
  - Student sees rejection on next visit

### `isRegistrationApproved(studentEmail)`
Checks if a student has approved registration.
- **Returns**: Boolean (true if status is "approved")
- **Used by**: EnrollmentGate wrapper to protect routes

### `hasRequestedRegistration(studentEmail)`
Checks if a student has submitted a registration request.
- **Returns**: Boolean (true if any request exists)
- **Used by**: Login to avoid duplicate requests

## Database/State Structure

All data is stored in React Context (AuthContext.jsx):

```javascript
registrationRequests: [
  {
    id, studentEmail, studentUsername, requestDate, status
  },
  // ...
]
```

Data persists only during the session. To make it persistent, integrate with a backend API.

## Styling

Two new CSS files created:

- **`registration.css`**: Styles for `RegistrationRequest.jsx`
  - Card-based layout with gradient background
  - Animated pulse effect on icon
  - Responsive design for mobile
  
- **`registration-management.css`**: Styles for `RegistrationManagement.jsx`
  - Statistics dashboard
  - Responsive table with hover effects
  - Color-coded status badges
  - Action button styling

## Integration Points

### With Existing Features
- ✅ Notifications system: Displays approval/rejection messages
- ✅ Admin Dashboard: Shows pending count card
- ✅ Sidebar: New admin navigation link
- ✅ Course enrollment: Protected by EnrollmentGate
- ✅ Support system: Admins can help with registration issues

### Not Affected
- ✅ Waitlist system: Works independently
- ✅ Conflict resolution: Works independently
- ✅ Credit limits: Still enforced after approval
- ✅ Timetable viewing: Available to all authenticated students

## Testing Scenarios

### Scenario 1: New Student Registration
1. Login as student (first time)
2. See registration request page
3. Click "Request Registration Access"
4. See pending status
5. (As admin) Approve request
6. (As student) See approval notification
7. Access courses page

### Scenario 2: Admin Rejection
1. (As admin) Go to registration management
2. See pending request
3. Click "Reject"
4. (As student) See rejection
5. (As student) Try to access courses → Redirected to request page

### Scenario 3: Re-requesting After Rejection
1. (After rejection) Student can submit new request
2. Request appears as new pending entry
3. Admin reviews and approves/rejects again

## Future Enhancements

1. **Bulk Approval**: Approve multiple requests at once
2. **Email Notifications**: Send emails on approval/rejection
3. **Request Comments**: Add comment field for rejection reasons
4. **Auto-Approval**: Set conditions for automatic approval
5. **Re-request Limits**: Limit how often students can resubmit
6. **Backend Integration**: Store data in database with persistence
7. **Bulk Import**: Upload student registrations from CSV
8. **Registration Periods**: Set registration-open dates

## Troubleshooting

### Student Cannot Apply for Registration
- Ensure student is logged in
- Check that `requestRegistration` is called in Login.jsx
- Verify AuthContext is providing the function

### Admin Cannot See Requests
- Ensure admin is logged in with correct password (admin123)
- Check that `/registration-management` route exists in App.jsx
- Verify RegistrationManagement.jsx imports are correct

### Approval Not Working
- Check browser console for errors
- Verify `approveRegistrationRequest` is in AuthContext
- Reload page to see updated status

### Student Cannot Access Courses After Approval
- Check if `isRegistrationApproved` in EnrollmentGate is working
- Verify routes in App.jsx have EnrollmentGate wrapper
- Clear browser cache and try again

## Backward Compatibility

This feature is **fully backward compatible**. All existing features continue to work:
- ✅ Existing students remain enrolled
- ✅ Course management unchanged
- ✅ Waitlist system unchanged
- ✅ Admin features unchanged

Only new enrollment attempts are affected by the registration gate.

---

**Status**: Fully implemented and tested ✅
**Version**: 1.0
**Last Updated**: December 2024
