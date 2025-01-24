const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Configuración de conexión a MongoDB
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

const db = mongoose.connection;

module.exports = db;
