import express from 'express';


const router = express.Router();


router.get('/', (req, res) => {
    res.json(consolasTest);
});

router.get('/:id', (req, res) => {
    const { id } = req.params; // const id = req.params.id;
    const consola = consolasTest[id - 1]; // Restamos 1 para ajustar el índice del array
    if (consola) {
        res.json(consola);
    } else {
        res.status(404).json({mensaje: 'Consola no encontrada'});
    }
});

router.post('/', (req, res) => {
    const nuevaConsola = req.body;
    console.log('Nueva consola recibida:', nuevaConsola);
    consolasTest.push(nuevaConsola);
    res.status(201).json(nuevaConsola);    
})




const consolasTest = [
    {
        "nombre": "Nintendo Entertainment System",
        "fabricante": "Nintendo",
        "año": 1985,
        "generacion": 3,
        "descripcion": "La consola que revivió la industria de los videojuegos. Incluye clásicos como Super Mario Bros y The Legend of Zelda.",
        "precioEstimado": 150,
    },
    {
        "nombre": "Super Nintendo Entertaiment System",
        "fabricante": "Nintendo",
        "año": 1991,
        "generacion": 4,
        "descripcion": "La sucesora de la NES con gráficos de 16 bits. Títulos icónicos como Super Mario World y Chrono Trigger",
        "precioEstimado": 200,
    },
];

export default router;