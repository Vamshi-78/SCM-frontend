import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import api from "../api/api";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e?.preventDefault?.();
    const normalizedUsername = String(username || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    if (!normalizedUsername || !normalizedEmail || !normalizedPassword) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await api.register({
        username: normalizedUsername,
        email: normalizedEmail,
        password: normalizedPassword,
        role: "student"
      });

      const loginRes = await api.loginStudent({
        email: normalizedEmail,
        password: normalizedPassword
      });

      const token = loginRes?.data?.token || loginRes?.data?.jwt || loginRes?.data?.accessToken || "";
      if (token) {
        localStorage.setItem("token", token);
      }

      const userData = loginRes?.data?.user || {
        email: normalizedEmail,
        username: normalizedUsername,
        role: "student",
        registrationApproved: loginRes?.data?.registrationApproved || 0
      };
      localStorage.setItem("user", JSON.stringify(userData));

      alert("Account Created Successfully! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed", err);
      if (!err.response) {
        alert("❌ Cannot reach backend server. Start backend and check API URL/proxy settings.");
        return;
      }
      const apiMessage = err.response?.data?.message || err.response?.data || "Registration failed";
      const messageText = String(apiMessage || "");
      if (/already exists|duplicate|email.*taken|user.*exists/i.test(messageText)) {
        alert("This email is already registered. Please login instead.");
      } else {
        alert(typeof apiMessage === "string" ? apiMessage : "Could not create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-shell">
        <section className="auth-hero">
          <div>
            <div className="auth-hero-badge">Student registration</div>
            <h1>Create your account once, then manage everything from one place.</h1>
            <p>
              Set up your student profile to access course enrollment, timetables, notifications, and support with a consistent experience.
            </p>
          </div>

          <div className="auth-highlights">
            <div className="auth-highlight">
              <strong>Simple setup</strong>
              <span>Just fill in your details and you are ready to log in.</span>
            </div>
            <div className="auth-highlight">
              <strong>Connected workflows</strong>
              <span>Your account links into approvals, courses, and notifications.</span>
            </div>
            <div className="auth-highlight">
              <strong>Professional feel</strong>
              <span>Clean layout, strong hierarchy, and no cluttered demo styling.</span>
            </div>
          </div>
        </section>

        <div className="auth-card auth-panel">
          <FaUserPlus className="auth-icon" />

          <h2 className="auth-section-title">Create Account</h2>
          <p className="auth-copy">Register as a student to start using the platform.</p>

          <input 
            type="text" 
            className="modern-input" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="email" 
            className="modern-input" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            className="modern-input" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignup} className="modern-btn" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;