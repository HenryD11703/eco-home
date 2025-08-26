import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaLeaf, 
  FaTag, 
  FaDollarSign, 
  FaImage, 
  FaBoxes, 
  FaFileAlt, 
  FaSave, 
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import api from '../api/axios';

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

const ProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    category: 'cocina',
    imageUrl: '',
    stock: 0,
  });

  const categories = [
    { value: 'cocina', label: 'Cocina', icon: '🍳' },
    { value: 'sala', label: 'Sala', icon: '🛋️' },
    { value: 'baño', label: 'Baño', icon: '🚿' },
    { value: 'decoracion', label: 'Decoración', icon: '🖼️' },
    { value: 'jardineria', label: 'Jardinería', icon: '🌱' }
  ];

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const res = await api.get(`/products/${id}`);
          setFormData(res.data);
        } catch (err) {
          console.error('Error al obtener el producto:', err);
          showNotification('error', 'Error al cargar el producto');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'price' || name === 'stock' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (id) {
        await api.put(`/products/${id}`, formData);
        showNotification('success', 'Producto actualizado con éxito');
      } else {
        await api.post('/products', formData);
        showNotification('success', 'Producto creado con éxito');
      }
      
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      showNotification('error', 'Error al guardar el producto. Verifica que eres administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
      {/* Notification */}
      {notification.type && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {id ? 'Editar Producto' : 'Crear Producto'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {id ? 'Actualiza la información del producto' : 'Añade un nuevo producto eco-friendly a tu tienda'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <FaArrowLeft />
              <span>Volver</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Name */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <FaTag className="text-emerald-500" />
                <span>Nombre del Producto</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Botella Reutilizable Ecológica"
                required
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <FaFileAlt className="text-emerald-500" />
                <span>Descripción</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe las características eco-friendly y beneficios del producto..."
                required
                rows={4}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium resize-none"
              />
            </div>

            {/* Price and Stock Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FaDollarSign className="text-emerald-500" />
                  <span>Precio</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-emerald-500 font-bold">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FaBoxes className="text-emerald-500" />
                  <span>Stock</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium"
                />
              </div>
            </div>

            {/* Category */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <FaLeaf className="text-emerald-500" />
                <span>Categoría</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-700 font-medium appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="group">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <FaImage className="text-emerald-500" />
                <span>URL de la Imagen</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen-producto.jpg"
                required
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 text-gray-700 font-medium"
              />
              {formData.imageUrl && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:scale-105 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span>{id ? 'Actualizar Producto' : 'Crear Producto'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;