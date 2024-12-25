const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

console.log(PORT);

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('This is the backend')
})

app.get('/api/test', (req, res) => {

    console.log('Solicitud recibida en /api/test');
    res.json({ message: 'Hola frontend, este es un mensaje desde el Backend' });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto${PORT}`);
});

/*// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tu_base_de_datos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

*/
