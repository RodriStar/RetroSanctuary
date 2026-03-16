const errorHandler = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let mensaje = err.message || 'Error interno del servidor';

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        mensaje = Object.values(err.errors)
            .map(e => e.message)
            .join(', ');
        statusCode = 400;
    }

    // Error de ObjectId inválido
    if (err.name === 'CastError') {
        mensaje = `ID inválido: ${err.value}`;
        statusCode = 400;
    }

    // Error de clave duplicada en MongoDB
    if (err.code === 11000) {
        const campo = Object.keys(err.keyValue)[0];
        mensaje = `El valor de ${campo} ya existe`;
        statusCode = 400;
    }

    // Error de JWT inválido
    if (err.name === 'JsonWebTokenError') {
        mensaje = 'Token inválido';
        statusCode = 401;
    }

    // Token expirado
    if (err.name === 'TokenExpiredError') {
        mensaje = 'Token expirado';
        statusCode = 401;
    }

    res.status(statusCode).json({
        status: 'error',
        mensaje
    });

};

export default errorHandler;