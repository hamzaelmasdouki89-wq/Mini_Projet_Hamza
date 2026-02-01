import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NotificationProvider } from "./layout/Notificationcontext";
import Notifications from "./layout/Notifications";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/my-color" element={<MyColor />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/my-requests" element={<MyRequests />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <Notifications />
        </NotificationProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
