import express from 'express';
import Juego from '../models/Juego.js';
import { autenticarJWT, autorizarRol } from '../middlewares/auth.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();


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


router.post('/', autenticarJWT, catchAsync(async (req, res) => {
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


router.get('/:id', catchAsync(async (req, res, next) => {

    const juego = await Juego
        .findById(req.params.id)
        .populate('consola')
        .populate('creador');

    if (!juego) {
        return next(new AppError('Juego no encontrado', 404));
    }

    res.json(juego);

}));



router.put('/:id', autenticarJWT, catchAsync(async (req, res) => {

    let filtro = { _id: req.params.id };

    if (req.usuario.role !== 'admin') {
        filtro.creador = req.usuario.id;
    }

    const juegoActualizado = await Juego.findOneAndUpdate(
        filtro,
        req.body,
        { returnDocument: 'after' }
    );

    if (!juegoActualizado) {
        return res.status(403).json({
            mensaje: 'No tienes permiso para editar este juego'
        });
    }

    res.json(juegoActualizado);

}));

router.delete('/:id', autenticarJWT, catchAsync(async (req, res, next) => {

    const juego = await Juego.findById(req.params.id);

    if (!juego) {
        return next(new AppError('Juego no encontrado', 404));
    }

    // Verificación de propiedad
    if (
        juego.creador.toString() !== req.usuario.id &&
        req.usuario.role !== 'admin'
    ) {
        return next(new AppError('No tienes permiso para borrar este juego', 403));
    }

    await juego.deleteOne();

    res.json({ mensaje: 'Juego eliminado correctamente' });

}));



export default router;