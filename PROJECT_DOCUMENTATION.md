# 🎓 Student Course Management System (SCM)

**FSAD-PS48**: Online Platform for Student Course Selection and Scheduling

A comprehensive web-based academic course management platform that enables students to select courses, build schedules, and manage registrations efficiently. The system handles course capacities, credit limits, scheduling conflicts, prerequisites, and provides administrative analytics and control tools.

## 🚀 Features Overview

### 👨‍🎓 STUDENT FEATURES

#### 1️⃣ **Dashboard**
- **Welcome Screen**: Personalized greeting with username "Welcome back, [username]"
- **Statistics Cards** (6 cards displayed):
  - 📚 Enrolled Courses count
  - 🎯 Total Credits earned
  - ⏰ Classes this week
  - ⏳ Waitlisted courses
  - 🎫 Open support tickets
  - 📊 Remaining credits (max 18)
- **Quick Schedule Overview**: Visual week view with courses by day
- **Waitlist Section**: View waitlisted courses with position
- **Course Cards**: Detailed enrolled course information with unenroll option

#### 2️⃣ **Course Selection & Enrollment**
- **Browse Available Courses**: Grid view with comprehensive details
- **Course Information Display**:
  - Course code and name
  - Day and time
  - Credits
  - Capacity and available seats (color-coded)
  - Prerequisites (if any)
  - Current enrollment count
- **Intelligent Enrollment Validation**:
  - ✅ Detect schedule conflicts
  - ✅ Prevent duplicate enrollment
  - ✅ Enforce maximum credit limit (18 credits)
  - ✅ Check prerequisites before enrollment
  - ✅ Automatic waitlist when course is full
- **Visual Feedback**:
  - Green: Seats available
  - Orange: Low seats (< 5)
  - Red: Course full

#### 3️⃣ **Schedule Builder (Timetable)**
- **Visual Weekly Timetable**: Monday to Friday, 9AM-4PM
- **Color-Coded Courses**: Beautiful gradient purple design
- **Course Details**: Full course information displayed in cells
- **Empty Slot Indicators**: "Free" slots clearly marked
- **Legend Section**: Visual guide for understanding the timetable
- **Empty State Message**: Helpful prompt when no courses enrolled

#### 4️⃣ **Help & Support System** 🆕
- **Quick Help Topics**:
  - 📖 How to Enroll
  - ⚠️ Schedule Conflicts
  - 🎯 Credit Limits
  - ⏳ Waitlist Information
- **Create Support Tickets**:
  - Subject and detailed description
  - Category selection (Enrollment Issue, Technical Problem, Course Information, etc.)
  - Priority levels (Low, Medium, High)
  - Real-time status tracking (Open, In Progress, Resolved, Closed)
- **My Tickets View**:
  - View all submitted tickets
  - Color-coded status badges
  - Admin responses in conversation format
  - Timestamp for all interactions
  - Ticket ID for reference

#### 5️⃣ **Profile Management**
- **Profile Avatar**: Auto-generated circle with username initial
- **Personal Information**:
  - Username
  - Email
  - Role badge
  - Enrolled courses count
  - Total credits
- **Enrolled Courses List**: Quick overview with schedule details

#### 6️⃣ **Enrollment Management**
- **Unenroll from Courses**: One-click with confirmation dialog
- **Automatic Waitlist Processing**: Auto-enroll when seat becomes available
- **Conflict Warnings**: Real-time alerts for schedule conflicts
- **Credit Tracking**: Visual remaining credits counter

---

### 👨‍💼 ADMIN FEATURES

#### 1️⃣ **Admin Dashboard**
- **Statistics Overview** (4 cards):
  - 📚 Total Courses
  - 👥 Total Students (unique count)
  - ✅ Total Enrollments
  - ⭐ Average Enrollments per Course
- **Most Popular Courses**: Top 5 courses with enrollment counts
- **Student Enrollments Search**:
  - Search functionality by student name or course
  - Detailed enrollment information cards
  - Student username and email
  - Course details with schedule
  - Arrow indicators for visual flow
- **Registered Students by Course**:
  - View all students enrolled in each course
  - Interactive student chips (hover effect)
  - Enrollment count badges per course
  - "No students enrolled yet" message for empty courses

#### 2️⃣ **Course Management**
- **Add New Courses Form**:
  - Course code (auto-uppercase)
  - Course name (auto-uppercase)
  - Day selection (dropdown: Mon-Fri)
  - Time selection (dropdown: 9AM-4PM)
  - Credits (1-5)
  - Capacity (10-100, default 30)
  - Prerequisites (comma-separated course codes)
- **Course Table**:
  - Comprehensive course listing
  - Capacity and enrollment tracking
  - Prerequisites display
  - Color-coded badges for day (blue), time (yellow), enrollment (purple)
  - Delete button with confirmation
  - Shows enrolled student count before deletion
- **Validation**:
  - Duplicate code prevention
  - Required field validation
  - Confirmation before deleting courses with enrollments

#### 3️⃣ **Support Ticket Management** 🆕
- **Statistics Dashboard** (4 cards):
  - 📋 Total tickets
  - 🔓 Open tickets
  - ⏳ In Progress tickets
  - ✅ Resolved tickets
- **Filter System**: Dropdown to filter by status
- **Ticket Cards**:
  - Student information (username, email)
  - Issue description
  - Category, status, and priority badges
  - Creation timestamp
  - Full conversation thread
- **Response System**:
  - Text area to reply to student tickets
  - Conversation view with role badges
  - Admin and student messages differentiated
  - Timestamp for each response
- **Status Management**:
  - Dropdown to update ticket status
  - Open → In Progress → Resolved → Closed workflow
  - Visual status indicators with colors
  - Closed banner for resolved tickets

#### 4️⃣ **Conflict Management**
- **Automatic Detection**: System prevents conflicting enrollments at enrollment time
- **Conflict Alerts**: Clear error messages when conflicts detected
- **Admin Overview**: Can see all student enrollments and schedules

#### 5️⃣ **Waitlist System**
- **Automatic Addition**: Students added to waitlist when course reaches capacity
- **Position Tracking**: Sequential position in waitlist
- **Auto-Enrollment**: Next student enrolled automatically when seat opens
- **Admin Visibility**: Can see waitlisted students (future enhancement)

---

## 🎨 UI/UX Enhancements

### Design Features
- **Modern Gradient Theme**: Purple/indigo color scheme (#667eea to #764ba2)
- **Animated Login Background**: Subtle moving grid pattern
- **Hover Effects**: 
  - Cards lift on hover (-3px to -5px translateY)
  - Smooth transitions (0.3s)
  - Shadow expansion on hover
- **Color-Coded Elements**: 
  - Status: Orange (Open), Blue (Progress), Green (Resolved), Gray (Closed)
  - Priority: Red (High), Orange (Medium), Green (Low)
  - Seats: Green (available), Orange (low), Red (full)
- **Responsive Design**: Grid layouts adapt to screen size
- **Smooth Animations**: CSS transitions on all interactive elements
- **Card-Based Layout**: Clean, organized information display
- **Icon Integration**: Emojis for visual appeal and quick recognition

### Accessibility
- **Clear Typography**: Inter font family, readable sizes
- **High Contrast**: Sufficient color contrast for readability
- **Intuitive Navigation**: Sidebar with clear icon labels
- **Visual Feedback**: Button states (hover, active, disabled)
- **Error Messages**: Clear, actionable alert messages
- **Form Validation**: Real-time validation with helpful messages

---

## 🔐 Authentication System

### Login Features
- **Role-Based Login**: Separate flows for Student and Admin
- **Student Login Fields**:
  - Username (required, new field)
  - Email (required)
  - Password (required)
- **Admin Login Fields**:
  - Email (required)
  - Password (required, hardcoded: admin123)
- **Session Management**: User state maintained in Context
- **Protected Routes**: Automatic redirection for unauthorized access
- **Logout**: Available from sidebar

---

## 📊 Data Management

### State Management (Context API)
- **AuthContext** provides:
  - User (email, role, username, password)
  - Courses (array with capacity, prerequisites, enrolled count)
  - Enrollments (array with student and course info)
  - Waitlist (array with position tracking)
  - Support Tickets (array with conversation threads)
  
### Business Logic
- **enrollCourse()**: 
  - Checks credit limit (max 18)
  - Validates prerequisites
  - Detects schedule conflicts
  - Checks capacity
  - Adds to waitlist if full
  - Updates enrolled count
  
- **unenrollCourse()**:
  - Removes enrollment
  - Updates enrolled count
  - Auto-enrolls next waitlisted student
  
- **createTicket()**:
  - Generates unique ticket ID
  - Stores student info
  - Initializes response array
  
- **respondToTicket()**:
  - Adds response to conversation
  - Includes role and timestamp
  
- **updateTicketStatus()**:
  - Changes ticket status
  - Maintains status history

---

## 🛠️ Technical Stack

- **Frontend**: React 18+
- **Build Tool**: Vite 7.3+
- **Routing**: React Router DOM v6
- **Styling**: Pure CSS (no framework)
- **State Management**: React Context API
- **Icons**: Emoji-based system
- **Dev Server**: Vite dev server
- **Code Quality**: ESLint configuration

---

## 📦 Installation & Setup

```bash
# Navigate to project directory
cd "Student Course Manager"

# Install dependencies
npm install

# Start development server
npm run dev

# Access application
# Open browser to: http://localhost:5173

# Build for production
npm run build
```

---

## 🎮 Usage Guide

### For Students:

1. **Access Application**: Open the website
2. **Select Role**: Click "Student" card
3. **Login**: 
   - Enter your username
   - Enter your email
   - Enter your password
4. **Dashboard**: View your statistics and enrolled courses
5. **Enroll in Courses**:
   - Click "Enroll Courses" in sidebar
   - Browse available courses
   - Check capacity and prerequisites
   - Click "Enroll Now" (or "Join Waitlist" if full)
6. **View Schedule**:
   - Click "Timetable" in sidebar
   - See weekly schedule with all enrolled courses
7. **Get Help**:
   - Click "Help & Support" in sidebar
   - Browse quick help topics
   - Create support ticket if needed
   - Track ticket status and responses
8. **Manage Enrollments**:
   - Return to Dashboard
   - Click "Unenroll" on any course card
   - Confirm the action

### For Admins:

1. **Access Application**: Open the website
2. **Select Role**: Click "Admin" card
3. **Login**:
   - Email: admin@scm.edu
   - Password: admin123
4. **View Dashboard**:
   - See total courses, students, enrollments
   - View most popular courses
   - Search and view all student enrollments
   - See students registered in each course
5. **Manage Courses**:
   - Click "Manage Courses" in sidebar
   - Fill in course details form
   - Add prerequisites if needed
   - Set course capacity
   - Click "Add Course"
   - Delete courses if needed (with confirmation)
6. **Handle Support Tickets**:
   - Click "Support Tickets" in sidebar
   - Filter tickets by status
   - Read student issues
   - Type response in text area
   - Click "Send Response"
   - Update ticket status as needed

---

## 🔑 Default Credentials

**Admin Account:**
- Email: admin@scm.edu
- Password: admin123
- (Hardcoded in Login.jsx)

**Student Accounts:**
- Create your own during first login
- Required: username, email, password
- (No signup page yet - just login with new credentials)

---

## 🌟 Key Highlights

✅ **Complete Course Management** - Add, edit, delete courses with full details
✅ **Intelligent Enrollment** - Auto-validation for conflicts, credits, prerequisites
✅ **Real-Time Conflict Detection** - Instant alerts when schedule conflicts occur
✅ **Automatic Waitlist** - Seamless queue management with auto-enrollment
✅ **Integrated Help System** - Students can create tickets, admins can respond
✅ **Beautiful Modern UI** - Gradient designs, smooth animations, responsive
✅ **Role-Based Access** - Separate interfaces for students and admins
✅ **Prerequisites Tracking** - Enforce course dependencies
✅ **Credit Limit** - Enforce 18 credit maximum per student
✅ **Comprehensive Admin Tools** - Full visibility and control
✅ **Student Analytics** - Track enrollments, waitlist, support needs
✅ **Username System** - Personalized experience with usernames

---

## 📝 All Implemented Features from Requirements

### FSAD-PS48 Requirements ✅

**Student Features:**
- [x] Select courses
- [x] Build schedules (timetable)
- [x] Manage registrations (enroll/unenroll)
- [x] View available classes
- [x] Conflict detection
- [x] Credit limits
- [x] Prerequisites checking

**Admin Features:**
- [x] Manage course listings (CRUD)
- [x] Handle registration (view all enrollments)
- [x] Resolve scheduling conflicts (prevent at enrollment)
- [x] Add courses with capacity
- [x] Set prerequisites
- [x] View students per course
- [x] Analytics dashboard

**Extended Features (Bonus):**
- [x] Help & Support ticket system
- [x] Waitlist management
- [x] Username-based login
- [x] Search functionality
- [x] Color-coded UI elements
- [x] Responsive design
- [x] Empty state messages
- [x] Confirmation dialogs
- [x] Real-time updates

---

## 📊 Component Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar with user info
│   ├── Sidebar.jsx         # Left sidebar with navigation links
│   ├── CourseCard.jsx      # Reusable course card component
│   └── ProtectedRoute.jsx  # Route guard for authentication
│
├── context/
│   └── AuthContext.jsx     # Global state management (all data & logic)
│
├── pages/
│   ├── RoleSelect.jsx      # Landing page: Choose Student or Admin
│   ├── Login.jsx           # Login page (dynamic based on role)
│   ├── Signup.jsx          # Signup page (not integrated yet)
│   │
│   ├── StudentDashboard.jsx    # Student home with stats & courses
│   ├── Courses.jsx             # Browse & enroll in courses
│   ├── Timetable.jsx           # Weekly schedule view
│   ├── Help.jsx                # Help topics & support tickets 🆕
│   ├── Profile.jsx             # User profile & info
│   │
│   ├── AdminDashboard.jsx      # Admin home with analytics
│   ├── ManageCourses.jsx       # Add/edit/delete courses
│   └── SupportManagement.jsx   # Manage support tickets 🆕
│
├── styles/
│   ├── global.css      # Global styles, auth pages, variables
│   ├── dashboard.css   # Dashboard, cards, tables, new features
│   └── layout.css      # Layout, sidebar, navbar
│
├── App.jsx     # Main app with routing
└── main.jsx    # Entry point
```

---

## 🔄 Data Flow

### Enrollment Flow:
```
Student clicks "Enroll Now"
  ↓
enrollCourse() in AuthContext
  ↓
Check: Total credits ≤ 18? → ❌ Alert & Stop
Check: Prerequisites met? → ❌ Alert & Stop
Check: Schedule conflict? → ❌ Alert & Stop
Check: Course at capacity? → ⏳ Add to waitlist
  ↓
✅ Add to enrollments array
✅ Update course.enrolled count
✅ Show success alert
```

### Waitlist Flow:
```
Course reaches capacity
  ↓
Next student added to waitlist
  ↓
Student unenrolls from course
  ↓
unenrollCourse() checks waitlist
  ↓
First student in waitlist auto-enrolled
  ↓
Removed from waitlist array
```

### Support Ticket Flow:
```
Student creates ticket
  ↓
createTicket() in AuthContext
  ↓
Generate unique ID, add to tickets array
  ↓
Admin views in Support Management
  ↓
Admin types response
  ↓
respondToTicket() adds to responses array
  ↓
Student sees response in Help page
```

---

## 🎯 Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | RoleSelect | Public |
| `/login/:role` | Login | Public |
| `/student` | StudentDashboard | Protected (Student) |
| `/courses` | Courses | Protected (Student) |
| `/timetable` | Timetable | Protected (Student) |
| `/help` | Help | Protected (Student) 🆕 |
| `/profile` | Profile | Protected (Both) |
| `/admin` | AdminDashboard | Protected (Admin) |
| `/manage-courses` | ManageCourses | Protected (Admin) |
| `/support-management` | SupportManagement | Protected (Admin) 🆕 |

---

## 🐛 Known Limitations

1. **No Backend**: All data is in-memory (resets on refresh)
2. **No Persistence**: No localStorage or database
3. **Single Admin**: Only one hardcoded admin account
4. **No Email**: Email field stored but not validated
5. **No Signup**: Signup component exists but not integrated
6. **No PDF Export**: Timetable export not implemented
7. **No Notifications**: No alerts for waitlist changes
8. **No Timezones**: All times are assumed same timezone

---

## 🚀 Future Enhancements

### High Priority:
- [ ] Backend API integration
- [ ] Database for persistence
- [ ] LocalStorage as fallback
- [ ] User registration system
- [ ] Email notifications
- [ ] PDF export for timetable

### Medium Priority:
- [ ] Search courses by name/code
- [ ] Filter courses by day/credits
- [ ] Analytics charts (bar, line)
- [ ] Semester system
- [ ] Course descriptions
- [ ] Instructor information

### Low Priority:
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Calendar integration
- [ ] Grade management
- [ ] Attendance tracking

---

## 🎓 Learning Outcomes

This project demonstrates:
- React component architecture
- Context API for state management
- React Router for navigation
- Protected routes & authentication
- CRUD operations
- Form handling & validation
- Responsive CSS design
- User experience design
- Role-based access control
- Complex business logic implementation

---

## 🤝 Credits

- **Project**: FSAD-PS48 Assignment
- **Developer**: [Your Name]
- **Tech Stack**: React + Vite
- **UI Inspiration**: Modern admin dashboards
- **Icons**: Emoji Unicode

---

## 📞 Support

For issues or questions about this project:
- Check this documentation first
- Review the code comments
- Test in the browser console
- Create a support ticket in the app! 😄

---

**Last Updated**: February 2026
**Version**: 1.0.0
**Status**: ✅ Fully Functional

---

*Developed with ❤️ for Academic Excellence*
