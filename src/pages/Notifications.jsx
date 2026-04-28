import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Notifications() {
  const { notifications, markNotificationAsRead, clearAllNotifications, user } = useContext(AuthContext);

  const userNotifications = notifications.filter(n => 
    n.userId === user?.email || n.userType === user?.role || n.userType === "all"
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "enrollment": return "✅";
      case "waitlist": return "⏳";
      case "conflict": return "⚠️";
      case "capacity": return "👥";
      case "ticket": return "🎫";
      case "system": return "📢";
      case "success": return "✨";
      case "warning": return "⚠️";
      case "info": return "ℹ️";
      default: return "🔔";
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case "success":
      case "enrollment":
        return "notification-success";
      case "warning":
      case "conflict":
        return "notification-warning";
      case "waitlist":
      case "info":
        return "notification-info";
      case "ticket":
        return "notification-ticket";
      default:
        return "notification-system";
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notifDate = new Date(timestamp);
    const diffMinutes = Math.floor((now - notifDate) / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>🔔 Notifications</h2>
          <p className="subtitle">Stay updated with your course activities and system announcements</p>
        </div>
        {userNotifications.length > 0 && (
          <button 
            className="clear-all-btn"
            onClick={clearAllNotifications}
          >
            Clear All
          </button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="unread-banner">
          <span>You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</span>
        </div>
      )}

      <div className="notifications-container">
        {userNotifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔕</div>
            <h3>No notifications yet</h3>
            <p>You'll see notifications here when there are updates about your courses</p>
          </div>
        ) : (
          <div className="notifications-list">
            {userNotifications
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${getNotificationClass(notification.type)} ${!notification.read ? "unread" : ""}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
