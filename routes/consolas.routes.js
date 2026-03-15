import express from 'express';
import Consola from '../models/Consola.js';
import { autenticarJWT, autorizarRol } from '../middlewares/auth.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();


router.get('/', async (req, res) => {
try {
        const consolas = await Consola.find({ isDeleted: false });
        res.json(consolas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener consolas', error: error.message
        });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const consola = await Consola.findOne({ _id: id, isDeleted: false });
        if (consola) {
            res.json(consola);
        } else {
            res.status(404).json({ mensaje: 'Consola no encontrada' });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la consola', error: error.message
        });
    }
});


router.post('/', autenticarJWT, autorizarRol('admin'), catchAsync(async (req, res, next) => {

    const nuevaConsola = new Consola(req.body);
    const consolaGuardada = await nuevaConsola.save();

    if (!consolaGuardada) {
        return next(new AppError('Error al crear la consola', 400));
    }

    res.status(201).json(consolaGuardada);

}));


router.put('/:id', autenticarJWT, autorizarRol('admin'), catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const consolaActualizada = await Consola.findOneAndReplace(
        { _id: id },
        req.body,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if (!consolaActualizada) {
        return next(new AppError('Consola no encontrada', 404));
    }

    res.json(consolaActualizada);

}));


router.patch('/:id', autenticarJWT, autorizarRol('admin'), catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const consolaActualizada = await Consola.findByIdAndUpdate(
        id,
        req.body,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    if (!consolaActualizada) {
        return next(new AppError('Consola no encontrada', 404));
    }

    res.json(consolaActualizada);

}));



router.delete('/:id', autenticarJWT, autorizarRol('admin'), catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const consolaEliminada = await Consola.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { returnDocument: 'after' }
    );

    if (!consolaEliminada) {
        return next(new AppError('Consola no encontrada', 404));
    }

    res.json({ mensaje: 'Consola eliminada correctamente' });

}));



export default router;