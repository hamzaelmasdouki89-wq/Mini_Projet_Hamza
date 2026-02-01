import { Outlet } from "react-router-dom";
import "./MainLayout.css";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";

function MainLayout() {
  return (
    <div>
      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
