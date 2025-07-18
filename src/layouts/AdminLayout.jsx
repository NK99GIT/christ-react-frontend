import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader  from "../components/AdminHeader";

const titleMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/quizzes":   "Quiz Management",
  "/admin/questions": "Question Management",
  "/admin/users":     "User Management",
  "/admin/leaderboard": "Leaderboard",
  "/admin/profile": "Profile",
  "/admin/analytics": "Analytics",
};

export default function AdminLayout() {
  const { pathname }            = useLocation();
  const [adminEmail, setEmail]  = useState("");
  const [sidebarOpen, setOpen]  = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem("adminEmail") || "");
  }, []);

  return (
    <div className="h-screen overflow-hidden flex bg-bg">
      {/* sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setOpen(false)} />

      {/* main column */}
      <div className="flex-1 flex flex-col  ml-0 ">
        <AdminHeader
          title={titleMap[pathname] || "Admin"}
          adminEmail={adminEmail}
          onToggleSidebar={() => setOpen(true)}
        />

        <main className="flex-1 px-6 py-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
