import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error al obtener productos:', err);
      }
    };
    fetchProducts();
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Producto eliminado con éxito.');
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Error al eliminar producto. Asegúrate de tener permisos de administrador.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>Acceso denegado. Redirigiendo...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Panel de Administración</h2>
      <button onClick={() => navigate('/admin/create')}>Añadir Nuevo Producto</button>
      <table className="products-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <button onClick={() => navigate(`/admin/edit/${product._id}`)}>Editar</button>
                <button onClick={() => handleDelete(product._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;