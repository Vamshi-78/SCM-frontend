import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, enrollments } = useContext(AuthContext);

  const myCourses = enrollments.filter(
    e => e.studentEmail === user?.email
  );

  const totalCredits = myCourses.reduce(
    (sum, e) => sum + e.course.credits,
    0
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>👤 My Profile</h2>
          <p className="subtitle">View and manage your account information</p>
        </div>
      </div>

      <div className="profile-container">
        <div className="card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="profile-info">
              <h2>{user?.username || "User"}</h2>
              <p className="role-badge">
                {user?.role === "admin" ? "🔑 Administrator" : "🎓 Student"}
              </p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">📧 Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">👤 Username:</span>
              <span className="detail-value">{user?.username}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">🎭 Role:</span>
              <span className="detail-value">
                {user?.role === "admin" ? "Administrator" : "Student"}
              </span>
            </div>

            {user?.role === "student" && (
              <>
                <div className="detail-item">
                  <span className="detail-label">📚 Enrolled Courses:</span>
                  <span className="detail-value">{myCourses.length}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">🎯 Total Credits:</span>
                  <span className="detail-value">{totalCredits}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {user?.role === "student" && myCourses.length > 0 && (
          <div className="card enrolled-courses-card">
            <h3>📖 Enrolled Courses</h3>
            <div className="enrolled-list">
              {myCourses.map(e => (
                <div key={e.course.code} className="enrolled-course-item">
                  <div className="course-code-pill">{e.course.code}</div>
                  <div className="course-details-profile">
                    <strong>{e.course.name}</strong>
                    <span className="course-schedule">
                      {e.course.day} at {e.course.time} • {e.course.credits} credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;