import { Link } from "react-router-dom";
import { getUser, clearSession } from "../services/api";
import "./Navbar.css";

function Navbar() {
  const user = getUser();

  // logout
  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">CampusHive</Link>
      <Link to="/resources">Resources</Link>
      <Link to="/add-resource">List Resource</Link>
      <Link to="/requests">Borrow Requests</Link>
      <Link to="/borrowed">My Borrowed</Link>

      {user ? (
        <>
          <span>Hi, {user.name}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
