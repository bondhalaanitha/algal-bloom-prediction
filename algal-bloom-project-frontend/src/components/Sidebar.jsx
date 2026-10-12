import {
  Home,
  LayoutDashboard,
  Brain,
  History,
  Info
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={20} />
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      name: "Predict Risk",
      path: "/prediction",
      icon: <Brain size={20} />
    },
    {
      name: "Prediction History",
      path: "/history",
      icon: <History size={20} />
    },
    {
      name: "About Project",
      path: "/about",
      icon: <Info size={20} />
    }
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        Monitoring System
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>
        <span>System Active</span>
      </div>

    </aside>
  );
}

export default Sidebar;