import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const role = user?.role;
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="navbar-cointainer" ref={navRef}>
      <div className="navbar-shell">
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="menu-icon" aria-hidden="true">☰</span>
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {role === "teacher" && (
          <>
            <NavLink to="/configuration" className="nav-link" onClick={closeMenu}>Configuration</NavLink>
            <NavLink to="/students" className="nav-link" onClick={closeMenu}>Students</NavLink>
            <NavLink to="/entermarks" className="nav-link" onClick={closeMenu}>Enter Marks</NavLink>
            <NavLink to="/consolidation" className="nav-link" onClick={closeMenu}>Consolidation</NavLink>
          </>
        )}

        <NavLink to="/marksheet" className="nav-link" onClick={closeMenu}>Marksheet</NavLink>
      </div>

      <div className={`navbar-actions ${menuOpen ? "open" : ""}`}>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
