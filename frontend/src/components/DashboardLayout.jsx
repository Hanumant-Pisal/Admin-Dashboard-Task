import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden"> 
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <Navbar />
        <div className="p-4 flex-1 overflow-auto"> 
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;



