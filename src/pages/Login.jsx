import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    try {
      const normalizedEmail = String(email || "").trim().toLowerCase();
      const normalizedPassword = String(password || "");

      if (!normalizedEmail || !normalizedPassword) {
        alert("Please enter all required fields");
        return;
      }
      
      const loggedInUser = await login(normalizedEmail, normalizedPassword);
      const targetPath = String(loggedInUser?.role || "").toLowerCase() === "admin" ? "/admin" : "/student";
      navigate(targetPath);

    } catch (err) {
      console.error("Login failed", err);
      if (!err.response) {
        alert("❌ Cannot reach backend server. Start backend and check API URL/proxy settings.");
        return;
      }
      const apiMessage = err.response?.data?.message || err.response?.data || "Invalid Credentials";
      const messageText = String(apiMessage || "");
      if (/invalid credentials|bad credentials|unauthorized/i.test(messageText)) {
        alert("Invalid credentials. Use your registered email and password.");
      } else {
        alert(typeof apiMessage === "string" ? apiMessage : "Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <section className="auth-hero">
          <div>
            <div className="auth-hero-badge">Secure access</div>
            <h1>Login once, go to your correct dashboard automatically.</h1>
            <p>
              Enter your email and password. Admin accounts open the admin portal and student accounts open the student portal.
            </p>
          </div>

          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Private access</strong>
              <span>Your account role is resolved automatically from your email login flow.</span>
            </div>
            <div className="auth-highlight">
              <strong>Reliable flow</strong>
              <span>Your session, approvals, and notifications remain linked once logged in.</span>
            </div>
            <div className="auth-highlight">
              <strong>Clean interface</strong>
              <span>Everything is styled to feel intentional, not like a demo project.</span>
            </div>
          </div>
        </section>

        <div className="auth-card auth-panel">
          <div className="auth-icon">🔐</div>
          <h2 className="auth-section-title">
            Login
          </h2>
          <p className="auth-copy">Use your registered credentials to continue.</p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modern-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="modern-input"
          />

          <button onClick={handleLogin} className="modern-btn">Login</button>

          <p className="auth-footer">
            New here? <Link to="/register">Create a student account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;