import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <section className="auth-hero">
          <div>
            <div className="auth-hero-badge">Student Course Manager</div>
            <h1>Manage courses with clarity and control.</h1>
            <p>
              A focused registration system for students and administrators, built to keep enrollment, approvals, and schedules organized without clutter.
            </p>
          </div>

          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Student access</strong>
              <span>Browse courses, track timetables, and manage enrollments from one place.</span>
            </div>
            <div className="auth-highlight">
              <strong>Admin control</strong>
              <span>Review registrations, manage courses, and handle support tickets efficiently.</span>
            </div>
            <div className="auth-highlight">
              <strong>Built to scale</strong>
              <span>Shared layouts, reusable controls, and connected workflows across the app.</span>
            </div>
          </div>
        </section>

        <section className="auth-card auth-panel">
          <div>
            <div className="auth-icon">🎓</div>
            <h2 className="auth-section-title">Select your role</h2>
            <p className="auth-copy">Continue to the correct sign-in flow for your account.</p>

            <div className="auth-steps">
              <span className="auth-step">Secure login</span>
              <span className="auth-step">Role-based access</span>
              <span className="auth-step">Connected UI</span>
            </div>
          </div>

          <div className="auth-actions">
            <button onClick={() => navigate("/login/admin")}>
              👨‍💼 Admin Login
            </button>

            <button onClick={() => navigate("/login/student")}>
              🎓 Student Login
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RoleSelect;