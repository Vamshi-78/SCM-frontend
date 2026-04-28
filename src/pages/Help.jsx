import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Help() {
  const { user, createTicket, supportTickets } = useContext(AuthContext);
  
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [showForm, setShowForm] = useState(false);

  const myTickets = supportTickets.filter(t => t.studentEmail === user?.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject || !description || !category) {
      alert("⚠ Please fill all required fields");
      return;
    }

    try {
      const ticketId = await createTicket({
        subject,
        description,
        category,
        priority
      });

      alert(`✅ Ticket #${ticketId} created successfully! Admin will respond soon.`);

      // Reset form
      setSubject("");
      setDescription("");
      setCategory("");
      setPriority("Medium");
      setShowForm(false);
    } catch {
      // Error alerts are already handled in context methods.
    }
  };

  const getStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "open": return "#f59e0b";
      case "in progress": return "#3b82f6";
      case "resolved": return "#10b981";
      case "closed": return "#6b7280";
      default: return "#94a3b8";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "#ef4444";
      case "Medium": return "#f59e0b";
      case "Low": return "#10b981";
      default: return "#94a3b8";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>💬 Help & Support</h2>
        <p className="subtitle">Get help with course registration, scheduling, or technical issues</p>
      </div>

      <div className="help-container">
        {/* Quick Help Section */}
        <div className="card help-section">
          <h3>📚 Quick Help Topics</h3>
          <div className="help-topics">
            <div className="help-topic-card">
              <div className="help-icon">📖</div>
              <h4>How to Enroll</h4>
              <p>Go to "Enroll Courses", browse available courses, and click "Enroll Now"</p>
            </div>
            <div className="help-topic-card">
              <div className="help-icon">⚠️</div>
              <h4>Schedule Conflicts</h4>
              <p>System automatically detects conflicts. Choose courses at different times.</p>
            </div>
            <div className="help-topic-card">
              <div className="help-icon">🎯</div>
              <h4>Credit Limits</h4>
              <p>Maximum 18 credits per semester. Minimum 12 credits for full-time status.</p>
            </div>
            <div className="help-topic-card">
              <div className="help-icon">⏳</div>
              <h4>Waitlist</h4>
              <p>If a course is full, you'll be added to waitlist automatically.</p>
            </div>
          </div>
        </div>

        {/* Create Ticket Button */}
        <div className="card">
          {!showForm ? (
            <button 
              className="create-ticket-btn"
              onClick={() => setShowForm(true)}
            >
              ➕ Create New Support Ticket
            </button>
          ) : (
            <div className="ticket-form">
              <h3>Create Support Ticket</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Subject *"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="help-input"
                  required
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="help-select"
                  required
                >
                  <option value="">Select Category *</option>
                  <option value="Enrollment Issue">Enrollment Issue</option>
                  <option value="Schedule Conflict">Schedule Conflict</option>
                  <option value="Technical Problem">Technical Problem</option>
                  <option value="Course Information">Course Information</option>
                  <option value="Account Issue">Account Issue</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="help-select"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>

                <textarea
                  placeholder="Describe your issue in detail *"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="help-textarea"
                  rows="6"
                  required
                />

                <div className="form-buttons">
                  <button type="submit" className="primary-btn">
                    Submit Ticket
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* My Tickets */}
        <div className="card">
          <h3>🎫 My Support Tickets ({myTickets.length})</h3>
          {myTickets.length === 0 ? (
            <p className="no-tickets">No tickets yet. Create one if you need help!</p>
          ) : (
            <div className="tickets-list">
              {myTickets.map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-header">
                    <div className="ticket-info">
                      <h4>#{ticket.id} - {ticket.subject}</h4>
                      <div className="ticket-meta">
                        <span className="ticket-category">{ticket.category}</span>
                        <span 
                          className="ticket-status"
                          style={{ background: getStatusColor(ticket.status) }}
                        >
                          {ticket.status}
                        </span>
                        <span 
                          className="ticket-priority"
                          style={{ borderColor: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="ticket-date">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="ticket-description">{ticket.description}</p>
                  
                  {ticket.responses && ticket.responses.length > 0 && (
                    <div className="ticket-responses">
                      <h5>📨 Responses:</h5>
                      {ticket.responses.map((response, idx) => (
                        <div key={idx} className="response-item">
                          <div className="response-header">
                            <strong>{response.by}</strong>
                            <span className="response-role">{response.role}</span>
                            <span className="response-time">
                              {new Date(response.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="response-message">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Help;
