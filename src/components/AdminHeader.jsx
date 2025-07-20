import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminHeader({ title, adminEmail, onToggleSidebar }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const initial = adminEmail?.charAt(0).toUpperCase();
 const UserImage =  localStorage.getItem("avatar")
 const UserName =  localStorage.getItem("name")
  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin/login";
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow flex items-center justify-between px-6 py-3">
        {/* left: sidebar + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded hover:bg-primary/10"
          >
            <HiMenu className="text-2xl text-primary" />
          </button>
          <span className="text-xl font-extrabold text-primary"></span>
          <span className="opacity-40 hidden sm:inline"></span>
          <h2 className="text-lg sm:text-2xl font-bold text-textPrimary hidden sm:inline">
            {title}
          </h2>
        </div>

        {/* right: avatar + name + logout */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden">
            <img
              src={`${UserImage}`}
              alt="admin"
              className="w-full h-full object-cover rounded"
            />
          </div>

          <span className="hidden sm:block text-sm text-textSecondary">
           {UserName}
          </span>

          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-1 text-sm text-error font-medium hover:underline"
          >
            <MdLogout className="text-lg" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-11/12 max-w-sm p-6 rounded-sm shadow-xl space-y-4"
            >
              <h3 className="text-xl font-bold text-textPrimary">
                Confirm Logout
              </h3>
              <p className="text-sm text-textSecondary">
                Are you sure you want to log out of your admin account?
              </p>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-bg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-error text-white rounded hover:bg-red-600"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
