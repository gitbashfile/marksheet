import { NavLink } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const role = user?.role;

  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  return (
    <div className="navbar-cointainer">

      {role === "teacher" && (
        <>
          <NavLink to="/configuration" className="nav-link">Configuration</NavLink>
          <NavLink to="/students" className="nav-link">Students</NavLink>
          <NavLink to="/entermarks" className="nav-link">Enter Marks</NavLink>
          <NavLink to="/consolidation" className="nav-link">Consolidation</NavLink>
        </>
      )}

      <NavLink to="/marksheet" className="nav-link">Marksheet</NavLink>

      <button onClick={logout} style={{ marginLeft: "auto" }}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;