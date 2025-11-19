import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaArrowRight, 
  FaTrash 
} from 'react-icons/fa';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const subtotal = cartItems.reduce((acc, item: CartItem) => acc + item.price * item.qty, 0);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 4000);
  };

  const handleCheckout = async () => {
    try {
      const response = await api.post('/orders/create-invoice', 
        { cartItems, total: subtotal },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      clearCart();
      showNotification('success', 'Compra completada. Factura descargada.');
    } catch (error) {
      console.error(error);
      showNotification('error', 'Error al procesar la compra');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 py-12 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
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

      <div className="container mx-auto relative z-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 rounded-2xl shadow-lg">
              <FaShoppingCart className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Tu Carrito de Compras
          </h1>
          <p className="text-gray-600 font-medium">
            Revisa tus productos seleccionados y procede al pago
          </p>
        </div>

        {/* Cart Content */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <FaShoppingCart className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg mb-6">
                Tu carrito está vacío.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 py-3 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                <span>Explorar Productos</span>
                <FaArrowRight className="text-lg" />
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-5 bg-white/50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <FaShoppingCart className="text-teal-500 text-xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
                        <p className="text-gray-600">Cantidad: {item.qty}</p>
                        <p className="text-teal-600 font-semibold">Precio: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      onClick={() => {
                        removeFromCart(item._id);
                        showNotification('success', `${item.name} eliminado del carrito`);
                      }}
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">Subtotal</h3>
                  <p className="text-2xl font-bold text-teal-600">${subtotal.toFixed(2)}</p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
                >
                  <span>Proceder al Pago</span>
                  <FaArrowRight className="text-lg" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ¿Necesitas ayuda?{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium underline">
              Contáctanos
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

export default CartPage;