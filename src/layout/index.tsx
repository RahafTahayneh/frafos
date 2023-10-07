import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AppRoutes from "../routes";
import Toolbar from "../components/Toolbar";

const MainLayout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <Toolbar />
        <div className="content-section">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
