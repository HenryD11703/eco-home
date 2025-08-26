import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)


.then(() => console.log('MongoDB conectado exitosamente.'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

app.get('/', (req, res) => {
    res.send('API de Eco-Home Goods está funcionando.');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});