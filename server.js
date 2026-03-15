import express from 'express';
import consolasRouter from './routes/consolas.routes.js';
import usuariosRouter from './routes/users.routes.js';
import juegosRouter from './routes/juegos.routes.js';
import conectarBD from './config/database.js';
import authRouter from './routes/auth.routes.js';


const app = express();
app.use(express.json());

await conectarBD();

app.use('/api/consolas', consolasRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/juegos', juegosRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});


app.use((err, req, res, next) => {

    // Manejo de errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        err.message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ');
        err.statusCode = 400;
    }

    res.status(err.statusCode || 500).json({
        status: 'error',
        mensaje: err.message
    });

});