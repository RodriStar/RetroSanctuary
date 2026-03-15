import express from 'express';
import Usuario from '../models/User.js';
import { autenticarJWT, autorizarRol } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', autenticarJWT, async (req, res) => {

    try {
        const usuarios = await Usuario.find({ isDeleted: false });
        console.log('ROL DE USUARIO DECODIFICADO:', req.usuario.role);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener usuarios', error: error.message
        });
    }
});

router.get('/:id', autenticarJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findOne({ _id: id, isDeleted: false });
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el usuario', error: error.message
        });
    }
});



router.delete('/:id', autenticarJWT, autorizarRol('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (usuarioEliminado) {
            res.json({ mensaje: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el usuario', error: error.message
        });
    }
});



export default router;