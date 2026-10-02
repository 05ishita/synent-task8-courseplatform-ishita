import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Learnify
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>


    {user.role === "admin" && (
      <Link to="/admin">Admin</Link>
    )}

            <span className="welcome">
              Hi, {user.name}
            </span>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;