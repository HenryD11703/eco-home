import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaLeaf, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Navbar Principal */}
      <nav className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo mejorado */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">Eco</span>
                <span className="text-2xl font-light text-emerald-100">Home</span>
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/products" 
                className="relative text-white/90 hover:text-white font-medium transition-all duration-300 group"
              >
                Productos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-200 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <Link 
                to="/cart" 
                className="relative flex items-center space-x-1 text-white/90 hover:text-white font-medium transition-all duration-300 group"
              >
                <FaShoppingCart className="text-lg group-hover:scale-110 transition-transform duration-300" />
                <span>Carrito</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-200 group-hover:w-full transition-all duration-300"></span>
              </Link>

              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
                    <FaUserCircle className="text-emerald-200 text-lg" />
                    <span className="text-white/90 text-sm font-medium capitalize">{user.role}</span>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Admin
                    </Link>
                  )}
                  
                  <button 
                    onClick={logout} 
                    className="bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40 shadow-lg"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-white/30 transition-all duration-300"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="bg-gradient-to-b from-emerald-700 to-green-700 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <Link 
                to="/products" 
                className="block text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              
              <Link 
                to="/cart" 
                className="flex items-center space-x-2 text-white/90 hover:text-white font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaShoppingCart />
                <span>Carrito</span>
              </Link>

              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-3 px-4 bg-white/5 rounded-lg">
                    <FaUserCircle className="text-emerald-200" />
                    <span className="text-white/90 capitalize">{user.role}</span>
                  </div>
                  
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block text-amber-300 hover:text-amber-200 font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-red-300 hover:text-red-200 font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="block text-center bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;