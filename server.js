import express from 'express';
import consolasRouter from './routes/consolas.routes.js';
import conectarBD from './config/database.js';

const app = express();
app.use(express.json());

await conectarBD();

app.use('/api/consolas', consolasRouter);

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});


