import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/dashboard.css"; // Ensure styles match perfectly

function AdminRegistrations() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from the JWT-secured Spring Boot backend
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getPendingRegistrations();
      // Assume backend returns a list of RegistrationRequest objects
      setPendingRequests(res.data || []);
    } catch (err) {
      console.error("Failed to load registration requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveRegistration(id);
      alert("✅ Student Approved Successfully!");
      fetchRequests(); // Refresh the dynamic list
    } catch (err) {
      alert("❌ Failed to approve student.");
    }
  };
  
  const handleReject = async (id) => {
    try {
      await api.rejectRegistration(id);
      alert("Student Rejected/Deleted.");
      fetchRequests();
    } catch (err) {
      alert("❌ Failed to reject student.");
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <h2>🛂 Registration Approvals</h2>
          <p className="welcome-text-large">View and approve pending student accounts securely.</p>
        </div>
      </div>

      <div className="card">
        <h3>Pending Students</h3>
        {loading ? (
          <p>Loading secure requests...</p>
        ) : pendingRequests.length === 0 ? (
          <div className="empty-state">
            <p>🎉 All caught up! No pending registration requests right now.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td><strong>#{req.id}</strong></td>
                    <td>{req.studentUsername || req.username || "N/A"}</td>
                    <td>{req.studentEmail || req.email || "N/A"}</td>
                    <td>
                      <span className="time-badge">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : req.requestDate
                            ? new Date(req.requestDate).toLocaleDateString()
                            : "New Request"}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button 
                          className="primary-btn success compact-btn" 
                          onClick={() => handleApprove(req.id)}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          className="danger-btn compact-btn" 
                          onClick={() => handleReject(req.id)}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRegistrations;
