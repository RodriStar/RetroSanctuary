import express from 'express';
import Juego from '../models/Juego.js';
import { autenticarJWT, autorizarRol } from '../middlewares/auth.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();

router.post('/', autenticarJWT, autorizarRol('admin'), catchAsync(async (req, res) => {
    const nuevoJuego = req.body;
    const creadorId = req.usuario.id; // Obtenemos el ID del usuario autenticado
    nuevoJuego.creador = creadorId; // Asignamos el ID del creador al juego

    const nuevoJuegoDoc = new Juego(nuevoJuego);
    const juegoGuardado = await nuevoJuegoDoc.save();
    res.status(201).json(juegoGuardado);
     
}));

router.get('/', async (req, res) => {
    try {
        const juegos = await Juego.find().populate('consola').populate('creador');
        res.json(juegos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener juegos', error: error.message });
    }
});

router.get('/promedioPrecio', catchAsync(async (req, res) => {

    //throw new Error('Error simulado para probar catchAsync');

    const resultado = await Juego.aggregate([
        {
            $group: {
                _id: null,
                precioPromedio: { $avg: "$precioEstimado" }
            }
        }
    ]);
    const precioPromedio = resultado[0]?.precioPromedio || 0;
    res.json({ precioPromedio });
}));

export default router;