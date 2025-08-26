import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    price: 0,
    category: 'cocina',
    imageUrl: '',
    stock: 0,
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          setFormData(res.data);
        } catch (err) {
          console.error('Error al obtener el producto:', err);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/products/${id}`, formData);
        alert('Producto actualizado con éxito.');
      } else {
        await api.post('/products', formData);
        alert('Producto creado con éxito.');
      }
      navigate('/admin');
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      alert('Error al guardar el producto. Verifica que eres administrador.');
    }
  };

  return (
    <div className="product-form-container">
      <h2>{id ? 'Editar Producto' : 'Crear Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required></textarea>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Precio" required />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="cocina">Cocina</option>
          <option value="sala">Sala</option>
          <option value="baño">Baño</option>
          <option value="decoracion">Decoración</option>
          <option value="jardineria">Jardinería</option>
        </select>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL de la Imagen" required />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required />
        <button type="submit">{id ? 'Actualizar' : 'Crear'}</button>
      </form>
    </div>
  );
};

export default ProductForm;