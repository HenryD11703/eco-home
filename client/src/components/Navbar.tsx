import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Eco-Home</Link>
      <div className="nav-links">
        <Link to="/products">Productos</Link>
        <Link to="/cart">
          <FaShoppingCart /> Carrito
        </Link>
        {user ? (
          <>
            <span className="user-info"><FaUserCircle /> {user.role}</span>
            <button onClick={logout} className="logout-btn">Salir</button>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;