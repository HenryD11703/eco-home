import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLeaf,
  FaSearch,
  FaShoppingCart,
  FaFilter,
  FaHeart,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  
  const { addToCart } = useCart();

  const categories = [
    { id: null, name: 'Todos', icon: '🌿' },
    { id: 'cocina', name: 'Cocina', icon: '🍽️' },
    { id: 'sala', name: 'Sala', icon: '🛋️' },
    { id: 'baño', name: 'Baño', icon: '🛁' },
    { id: 'decoracion', name: 'Decoración', icon: '🎨' },
    { id: 'jardineria', name: 'Jardinería', icon: '🌱' }
  ];

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const url = category ? `/products?category=${category}` : '/products';
        const res = await api.get(url);
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error(err);
        showNotification('error', 'Error al cargar los productos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      qty: 1
    });
    showNotification('success', `${product.name} añadido al carrito`);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/20 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200">
            <FaHeart className="text-red-500" />
          </button>
          <Link 
            to={`/product/${product._id}`}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <FaEye className="text-emerald-600" />
          </Link>
        </div>

        {/* Badge de categoría */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {categories.find(cat => cat.id === product.category)?.name || 'Producto'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            ${product.price}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>

        <button
          onClick={() => handleAddToCart(product)}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <FaShoppingCart className="text-sm" />
          <span>Añadir al carrito</span>
        </button>
      </div>
    </div>
  );

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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 rounded-2xl shadow-lg">
              <FaLeaf className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            Productos Eco-Friendly
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl mx-auto">
            Descubre nuestra selección de productos sostenibles para tu hogar. Cada compra contribuye a un futuro más verde.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 sticky top-8">
              {/* Search */}
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FaSearch className="text-emerald-500" />
                  <span>Buscar productos</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700"
                  />
                  <FaSearch className="absolute left-3 top-3.5 text-emerald-500" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
                  <FaFilter className="text-emerald-500" />
                  <span>Categorías</span>
                </div>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setCategory(cat.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                          category === cat.id
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="w-full lg:w-3/4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <FaSpinner className="animate-spin text-4xl text-emerald-500 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Cargando productos...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                  <FaLeaf className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No hay productos disponibles</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'No se encontraron productos con ese término de búsqueda.' : 'No hay productos en esta categoría.'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-6">
                  <p className="text-gray-600 font-medium">
                    Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                    {category && (
                      <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {categories.find(cat => cat.id === category)?.name}
                      </span>
                    )}
                  </p>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </main>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;