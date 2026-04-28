import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

function StudentDashboard() {
  const { enrollments, user, unenrollCourse, waitlist, supportTickets, requestRegistrationApproval } = useContext(AuthContext);

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeWaitlist = Array.isArray(waitlist) ? waitlist : [];
  const safeSupportTickets = Array.isArray(supportTickets) ? supportTickets : [];

  const myCourses = safeEnrollments.filter(
    e => e?.studentEmail === user?.email
  );

  const totalCredits = myCourses.reduce(
    (sum, e) => sum + Number(e?.course?.credits || 0),
    0
  );

  const myWaitlist = safeWaitlist.filter(w => w?.studentEmail === user?.email);
  const myTickets = safeSupportTickets.filter(t => t?.studentEmail === user?.email);
  const openTickets = myTickets.filter((t) => {
    const status = String(t?.status || "").toLowerCase();
    return status === "open" || status === "in progress";
  });

  // Group courses by day for a quick schedule view
  const scheduleByDay = {
    Mon: myCourses.filter(e => e?.course?.day === "Mon"),
    Tue: myCourses.filter(e => e?.course?.day === "Tue"),
    Wed: myCourses.filter(e => e?.course?.day === "Wed"),
    Thu: myCourses.filter(e => e?.course?.day === "Thu"),
    Fri: myCourses.filter(e => e?.course?.day === "Fri")
  };

  const handleUnenroll = (courseCode) => {
    if (window.confirm("Are you sure you want to unenroll from this course?")) {
      unenrollCourse(courseCode);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <h2>🎓 Student Dashboard</h2>
          <p className="welcome-text-large">Welcome back, <strong>{user?.username}</strong>!</p>
        </div>
      </div>

      {user?.registrationApproved !== 1 && (
        <div className="card dashboard-alert">
          <h3>🔒 Account Pending Approval</h3>
          <p>
            Your account has limited access until an Admin approves your registration. Course selection and scheduling are currently locked.
          </p>
          <button 
            className="modern-btn"
            onClick={requestRegistrationApproval}
          >
            📩 Request Registration Approval
          </button>
        </div>
      )}

      <div className="stats-box-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📚</div>
          <h4>Enrolled Courses</h4>
          <p>{myCourses.length}</p>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">🎯</div>
          <h4>Total Credits</h4>
          <p>{totalCredits}</p>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">⏰</div>
          <h4>Classes This Week</h4>
          <p>{myCourses.length}</p>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏳</div>
          <h4>Waitlisted</h4>
          <p>{myWaitlist.length}</p>
        </div>

        <div className="stat-card stat-card-danger">
          <div className="stat-icon">🎫</div>
          <h4>Open Tickets</h4>
          <p>{openTickets.length}</p>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">📊</div>
          <h4>Credit Remaining</h4>
          <p>{18 - totalCredits}</p>
        </div>
      </div>

      {/* Quick Schedule Overview */}
      <div className="card">
        <h3>📅 Quick Schedule Overview</h3>
        <div className="quick-schedule">
          {Object.entries(scheduleByDay).map(([day, courses]) => (
            <div key={day} className="day-schedule">
              <div className="day-label">{day}</div>
              <div className="day-courses">
                {courses.length > 0 ? (
                  courses.map((e, idx) => (
                    <div key={`${e?.course?.code || "course"}-${idx}`} className="mini-course-chip">
                      {e?.course?.code || "N/A"} ({e?.course?.time || "TBA"})
                    </div>
                  ))
                ) : (
                  <span className="no-class">No classes</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waitlist Section */}
      {myWaitlist.length > 0 && (
        <div className="card waitlist-section">
          <h3>⏳ Waitlisted Courses ({myWaitlist.length})</h3>
          <div className="waitlist-items">
            {myWaitlist.map((w, idx) => (
              <div key={idx} className="waitlist-item">
                <div>
                  <strong>{w?.course?.code || "N/A"}</strong> - {w?.course?.name || "No Name"}
                </div>
                <span className="waitlist-badge">Position: {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3>My Enrolled Courses</h3>

      <div className="course-grid">
        {myCourses.length > 0 ? (
          myCourses.map((e, idx) => (
            <div key={e?.course?.code || idx} className="course-card enhanced-course-card">
              <div className="course-header">
                <span className="course-code-badge">{e?.course?.code || "N/A"}</span>
                <span className="credit-badge">{Number(e?.course?.credits || 0)} Credits</span>
              </div>
              <h3>{e?.course?.name || "No Name"}</h3>
              <div className="course-details">
                <p>📅 {e?.course?.day || "TBA"}</p>
                <p>⏰ {e?.course?.time || "TBA"}</p>
              </div>
              <button 
                className="danger-btn"
                onClick={() => handleUnenroll(e?.course?.code)}
              >
                Unenroll
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>📚 You haven't enrolled in any courses yet.</p>
            <p>Visit the Courses page to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;