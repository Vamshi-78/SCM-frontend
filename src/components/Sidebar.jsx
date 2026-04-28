import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
  const { logout, user, notifications } = useContext(AuthContext);

  const unreadCount = notifications.filter(n => 
    !n.read && (n.userId === user?.email || n.userType === user?.role || n.userType === "all")
  ).length;

  return (
    <div className="sidebar">
      <div>
        <h2>SCM</h2>

        {user?.role === "student" && (
          <>
            <NavLink to="/student">Dashboard</NavLink>
            <NavLink to="/courses">
              Enroll Courses {user?.registrationApproved !== 1 && "🔒"}
            </NavLink>
            <NavLink to="/timetable">
              Timetable {user?.registrationApproved !== 1 && "🔒"}
            </NavLink>
            <NavLink to="/help">Help & Support</NavLink>
            <NavLink to="/notifications" className="notification-link">
              Notifications
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}

       {user?.role === "admin" && (
  <>
    <NavLink to="/admin">Dashboard</NavLink>
    <NavLink to="/admin/registrations">Registration Requests</NavLink>
    <NavLink to="/manage-courses">Manage Courses</NavLink>
    <NavLink to="/support-management">Support Tickets</NavLink>
    <NavLink to="/notifications" className="notification-link">
      Notifications
      {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
    </NavLink>
    <NavLink to="/profile">Profile</NavLink>
  </>
)}
      </div>

      <div className="logout-btn" onClick={logout}>
        Logout
      </div>
    </div>
  );
}

export default Sidebar;