import jwt from 'jsonwebtoken';

export const autenticarJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log('Token recibido:', token);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Error al verificar el token:', err);
                return res.status(401).json({ mensaje: 'Token inválido' });
            }
            req.usuario = decoded;
            next();
        });
    } else {
        res.status(401).json({ mensaje: 'Acceso no autorizado' });
    }
};

export const autorizarRol = (rolPermitido) => {
    return (req, res, next) => {
        if (req.usuario?.role === rolPermitido) {
            console.log(`Usuario autorizado con rol: ${req.usuario.role}`);
            next();
        } else {
            console.log(`Usuario no autorizado. Rol requerido: ${rolPermitido}, rol del usuario: ${req.usuario?.role}`);
            return res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción' });
        }
    };
};
