import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
          CommonGround
        </div>

        <div className="navbar-links">
          <button
            className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button
            className={isActive("/activities") ? "nav-link active" : "nav-link"}
            onClick={() => navigate("/activities")}
          >
            Activities
          </button>
          <button
            className={
              isActive("/my-activities") ? "nav-link active" : "nav-link"
            }
            onClick={() => navigate("/my-activities")}
          >
            My Activities
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
