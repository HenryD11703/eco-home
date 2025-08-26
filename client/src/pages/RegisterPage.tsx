import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserPlus,
  FaSignInAlt,
  FaShieldAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const { login } = useAuth();

  // Password validation
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';
  const isFormValid = email && password && confirmPassword && 
                     Object.values(passwordValidation).every(Boolean) && passwordsMatch;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      showNotification('error', 'Por favor completa todos los campos correctamente');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/register', { email, password });
      showNotification('success', '¡Cuenta creada exitosamente! Bienvenido a Eco-Home');
      
      // Pequeño delay para mostrar el mensaje de éxito
      setTimeout(() => {
        login(res.data.token);
      }, 1500);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Error al registrarse. El email podría estar en uso.');
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean, text: string }) => (
    <div className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
      isValid ? 'text-green-600' : 'text-gray-400'
    }`}>
      {isValid ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-60 left-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Notification */}
      {notification.type && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-500 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? <FaCheckCircle className="text-lg" /> : <FaExclamationTriangle className="text-lg" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-lg w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
                <FaUserPlus className="text-white text-3xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              ¡Únete a Eco-Home!
            </h1>
            <p className="text-gray-600 font-medium">
              Crea tu cuenta y comienza tu viaje ecológico
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <FaEnvelope className="text-teal-500" />
                <span>Correo Electrónico</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium"
                />
                <FaEnvelope className="absolute left-4 top-4 text-teal-500" />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <FaLock className="text-teal-500" />
                <span>Contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium"
                />
                <FaLock className="absolute left-4 top-4 text-teal-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-teal-500 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Validation */}
              {password && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <FaShieldAlt className="text-teal-500" />
                    <span>Requisitos de contraseña:</span>
                  </div>
                  <ValidationItem isValid={passwordValidation.length} text="Mínimo 8 caracteres" />
                  <ValidationItem isValid={passwordValidation.hasLetter} text="Al menos una letra" />
                  <ValidationItem isValid={passwordValidation.hasNumber} text="Al menos un número" />
                  <ValidationItem isValid={passwordValidation.hasSpecial} text="Al menos un carácter especial" />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <FaLock className="text-teal-500" />
                <span>Confirmar Contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium ${
                    confirmPassword === '' 
                      ? 'border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
                      : passwordsMatch 
                        ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                        : 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  }`}
                />
                <FaLock className="absolute left-4 top-4 text-teal-500" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-teal-500 transition-colors duration-200"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`mt-2 flex items-center space-x-2 text-sm font-medium ${
                  passwordsMatch ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passwordsMatch ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                  <span>{passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                isLoading || !isFormValid
                  ? 'bg-gray-400 cursor-not-allowed scale-95' 
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin text-xl" />
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <FaUserPlus className="text-lg" />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 px-4 text-gray-500 text-sm font-medium">¿Ya tienes cuenta?</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <Link 
            to="/login"
            className="w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-lg border-2 border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 transform hover:scale-105 group"
          >
            <FaSignInAlt className="text-lg group-hover:scale-110 transition-transform duration-200" />
            <span>Iniciar Sesión</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Al crear una cuenta, aceptas nuestros{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium underline">
              términos de servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium underline">
              política de privacidad
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;