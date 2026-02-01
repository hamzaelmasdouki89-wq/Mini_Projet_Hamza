import { Outlet } from "react-router-dom";
import "./MainLayout.css";
import Sidebar from "../layout/Sidebar";

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
