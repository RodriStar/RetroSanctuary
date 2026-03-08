import express from 'express';
import consolasRouter from './routes/consolas.routes.js';

const app = express();
app.use(express.json());

app.use('/api/consolas', consolasRouter);

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});


