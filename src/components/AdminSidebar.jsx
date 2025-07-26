import {
  MdDashboard,
  MdQuiz,
  MdPeople,
  MdBarChart,
  MdPerson,
  MdLeaderboard,
} from "react-icons/md";
import { NavLink } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Logo from "../assets/Images/logo-with-black.png";

/* navigation map */
const links = [
  { to: "/admin/dashboard", label: "Dashboard",   icon: MdDashboard },
  { to: "/admin/quizzes",   label: "Quizzes",     icon: MdQuiz },
  // { to: "/admin/users",     label: "Users",       icon: MdPeople },
  // { to: "/admin/analytics", label: "Analytics",   icon: MdBarChart },
  { to: "/admin/leaderboard",     label: "Leaderboard", icon: MdLeaderboard },
  { to: "/admin/profile",         label: "Profile",     icon: MdPerson },
];

export default function AdminSidebar({ open = false, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-56 min-w-56 bg-white shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static
      `}
    >
      {/* Close button (mobile) */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 md:hidden p-1 rounded hover:bg-primary/10"
      >
        <IoClose className="text-2xl text-primary" />
      </button>

      {/* Brand */}
      <div className="p-3 text-primary font-extrabold text-lg">
         <span className="text-textPrimary font-semibold ">
<img src={Logo} className="w-30 mx-auto" /> 

         </span>
      </div>

      {/* Nav links */}
      <nav className="mt-4 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `mx-4 flex items-center gap-3 px-3 py-2 rounded-sm
               ${isActive ? "bg-primary/10 text-primary" : "text-textSecondary"}
               hover:bg-primary/5 transition`
            }
          >
            <Icon className="text-xl" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
