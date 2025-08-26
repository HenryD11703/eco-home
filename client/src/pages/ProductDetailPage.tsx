import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FaLeaf,
  FaShoppingCart,
  FaHeart,
  FaShare,
  FaStar,
  FaCheck,
  FaTimes,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaTruck,
  FaRecycle
} from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category?: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 4000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        showNotification('error', 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      addToCart({ 
        _id: product._id, 
        name: product.name, 
        price: product.price, 
        qty: quantity 
      });
      showNotification('success', `${product.name} añadido al carrito (${quantity} ${quantity === 1 ? 'unidad' : 'unidades'})`);
    } catch (err) {
      showNotification('error', 'Error al añadir el producto al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment' && quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showNotification('success', isFavorite ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('success', 'Enlace copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 text-center">
          <FaSpinner className="animate-spin text-4xl text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 text-center">
          <FaTimes className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Producto no encontrado</h2>
          <p className="text-gray-500 mb-4">El producto que buscas no existe o ha sido eliminado.</p>
          <Link 
            to="/products"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300"
          >
            <FaArrowLeft />
            <span>Volver a productos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
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

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-white/20 text-gray-600 hover:text-emerald-600 transition-all duration-300 hover:scale-105"
          >
            <FaArrowLeft />
            <span className="font-medium">Volver</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20 overflow-hidden group">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/20 text-center">
                <FaRecycle className="text-2xl text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">100% Eco-Friendly</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/20 text-center">
                <FaTruck className="text-2xl text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Envío Gratis</p>
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md border border-white/20 text-center">
                <FaShieldAlt className="text-2xl text-teal-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Garantía 2 años</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      {product.category || 'Eco-Product'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.5) • 127 reseñas</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-xl shadow-md transition-all duration-300 hover:scale-110 ${
                      isFavorite 
                        ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                        : 'bg-white/50 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-white/50 text-gray-400 hover:text-emerald-500 rounded-xl shadow-md transition-all duration-300 hover:scale-110"
                  >
                    <FaShare />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                <span className="text-lg text-gray-500 ml-2">USD</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  {product.stock > 0 ? (
                    <>
                      <FaCheck className="text-green-500" />
                      <span className="text-green-600 font-medium">En stock ({product.stock} disponibles)</span>
                    </>
                  ) : (
                    <>
                      <FaTimes className="text-red-500" />
                      <span className="text-red-600 font-medium">Agotado</span>
                    </>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cantidad
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange('decrement')}
                        disabled={quantity <= 1}
                        className="p-3 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-6 py-3 font-semibold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange('increment')}
                        disabled={quantity >= product.stock}
                        className="p-3 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Total: <span className="font-semibold text-emerald-600">${(product.price * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  product.stock === 0 || isAddingToCart
                    ? 'bg-gray-400 cursor-not-allowed scale-95' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                } text-white`}
              >
                {isAddingToCart ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    <span>Añadiendo...</span>
                  </>
                ) : product.stock === 0 ? (
                  <span>Producto agotado</span>
                ) : (
                  <>
                    <FaShoppingCart className="text-lg" />
                    <span>Añadir al carrito</span>
                  </>
                )}
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaLeaf className="text-emerald-500" />
                <span>Compromiso Eco-Friendly</span>
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Fabricado con materiales 100% sostenibles</p>
                <p>• Proceso de producción neutro en carbono</p>
                <p>• Embalaje biodegradable y reciclable</p>
                <p>• Por cada compra, plantamos un árbol</p>
              </div>
            </div>
          </div>
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

export default ProductDetailPage;