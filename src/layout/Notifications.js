import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useNotification } from "./Notificationcontext";
import "./Notifications.css";

function Notifications() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}>
          <div className="notification-icon">{getIcon(notification.type)}</div>
          <div className="notification-content">
            <p className="notification-message">{notification.message}</p>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}>
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
