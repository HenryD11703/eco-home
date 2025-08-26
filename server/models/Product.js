import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true // Trim hace que se eliminen los espacios en blanco al inicio y al final
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es requerida']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es requerido'],
    },
    category: {
        type: String,
        enum: ['cocina', 'sala', 'baño', 'decoración', 'jardín'],
        required: [true, 'La categoría del producto es requerida']
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen del producto es requerida']
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es requerido'],
        default: 1
    }
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
