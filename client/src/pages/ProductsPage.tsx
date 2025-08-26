import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category ? `/products?category=${category}` : '/products';
        const res = await api.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="products-container">
      <aside className="sidebar">
        <h4>Categorías</h4>
        <ul>
          <li onClick={() => setCategory(null)}>Todos</li>
          <li onClick={() => setCategory('cocina')}>Cocina</li>
          <li onClick={() => setCategory('sala')}>Sala</li>
          <li onClick={() => setCategory('baño')}>Baño</li>
          <li onClick={() => setCategory('decoracion')}>Decoración</li>
          <li onClick={() => setCategory('jardineria')}>Jardinería</li>
        </ul>
      </aside>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </Link>
            <button>Añadir al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;