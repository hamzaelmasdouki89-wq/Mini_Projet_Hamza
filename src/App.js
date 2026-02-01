import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Your Redux store
import { NotificationProvider } from "./layout/Notificationcontext";
import Notifications from "./layout/Notifications";

// Auth Routes
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

// Layout Routes
import Home from "./layout/Home";
import Profile from "./layout/Profile";
import Users from "./layout/Users";
import MyColor from "./layout/MyColor";
import Requests from "./layout/Requests";
import MainLayout from "./components/MainLayout";
import MyRequests from "./layout/MyRequests";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NotificationProvider>
          <Routes>
            {/* Authentication Routes - No Sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Main Routes - With Sidebar */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/my-color" element={<MyColor />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/my-requests" element={<MyRequests />} />
              {/* Add more routes here as needed */}
            </Route>

            {/* Redirect to login if no route matches */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* Global Notifications Component */}
          <Notifications />
        </NotificationProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
