import express from 'express';
import Product from '../models/Product.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Obtener todos los productos (con filtrado)
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        const query = {};

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// @route   GET /api/products/:id
// @desc    Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        res.status(500).send('Error del servidor.');
    }
});

// @route   POST /api/products
// @desc    Crear un producto (Admin)
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// @route   PUT /api/products/:id
// @desc    Actualizar un producto (Admin)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

// @route   DELETE /api/products/:id
// @desc    Eliminar un producto (Admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        res.json({ msg: 'Producto eliminado.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor.');
    }
});

export default router;