import express from 'express';
import Usuario from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/registrar', async (req, res) => {
    const nuevoUsuarioData = req.body;
    try {
        const nuevoUsuario = new Usuario(nuevoUsuarioData);

        // Hashear la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, salt);

        console.log({ salt, hashedPassword: nuevoUsuario.password });

        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(400).json({
            mensaje: 'Error al crear el usuario', error: error.message
        });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email, isDeleted: false });
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }
        const token = jwt.sign(
            {
                id: usuario._id,
                username: usuario.username,
                email: usuario.email,
                role: usuario.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al iniciar sesión', error: error.message
        });
    }
});

export default router;