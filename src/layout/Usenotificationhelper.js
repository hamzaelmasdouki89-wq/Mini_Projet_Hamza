import { useNotification } from "./Notificationcontext";

export const useNotificationHelper = () => {
  const { addNotification } = useNotification();

  return {
    success: (message) => addNotification("success", message, 3000),
    error: (message) => addNotification("error", message, 7000),
    warning: (message) => addNotification("warning", message, 5000),
    info: (message) => addNotification("info", message, 4000),
    persistent: (type, message) => addNotification(type, message, 0),
  };
};
