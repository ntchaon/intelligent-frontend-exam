import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="h-full flex flex-col">
      <nav className="py-4 grid gap-1 pr-4">
        <div className="logo mb-4">
          <img  src="images/logo-test.png" alt="Logo" />
        </div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-menu active" : "nav-menu"
          }
        >
          <div>
            <img className="me-2" src="images/icon-nav-dashboard.png" alt="" />
            Dashboard
          </div>
        </NavLink>
        <NavLink
          to="/KPIManagement"
          className={({ isActive }) =>
            isActive ? "nav-menu active" : "nav-menu"
          }
        >
          <div>
            <img className="me-2" src="images/icon-nav-KPI.png" alt="" />
            KPI Management
          </div>
        </NavLink>{" "}
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? "nav-menu active" : "nav-menu"
          }
        >
          <div>
            <img className="me-2" src="images/icon-nav-KPI.png" alt="" />
            Users
          </div>
        </NavLink>
      </nav>

      {user && (
        <div className="px-3 pb-3 mt-auto">
          <div className="h-px bg-gray-200/70 mb-3" />
          <div className="nav-menu active !cursor-default">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">
                  {user.name}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs py-1"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
