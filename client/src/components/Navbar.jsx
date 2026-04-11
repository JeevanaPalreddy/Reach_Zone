import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Reachzone</Link>
      </div>
      <div className="navbar-actions">
        <ThemeToggle />
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/generate">Generate</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/prep">Interview Prep</Link>
              <Link to="/profile">Profile</Link>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-auth-btn">
                Login
              </Link>
              <Link to="/register" className="nav-auth-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

