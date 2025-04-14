const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const conexionMysql = require('express-myconnection');
const opcionesDB = require('./configuracion/baseDatos');
const rutasPropiedades = require('./rutas/propiedadRutas');
const path = require('path');

const app = express();  // inicializamos la aplicación express
app.set('puerto', process.env.PORT || 9000);  // configuramos el puerto, si no se pasa uno, usamos el 9000

// middleware de CORS ------------------------------------
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // permite peticiones desde el dominio del frontend
    methods: ['GET', 'POST'],  // solo permitimos los métodos GET y POST
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// otros middlewares -------------------------------------
app.use(conexionMysql(mysql, opcionesDB, 'single'));  // configuramos la conexión a MySQL
app.use(express.json());  // middleware para parsear el cuerpo de las solicitudes como JSON
app.use('/imagenes/propiedades', express.static(path.join(__dirname, 'imagenes/propiedades')));  // habilitamos la carpeta de imágenes como estática

// rutas -------------------------------------------
app.get('/', (req, res) => {
    res.send('Bienvenido a la API Inmobiliaria');  // ruta inicial que devuelve un mensaje
});

app.use('/api/propiedades', rutasPropiedades);  // manejamos las rutas de propiedades

const agenteRutas = require('./rutas/agenteRutas');  // importamos las rutas de los agentes
app.use('/api/agentes', agenteRutas);  // manejamos las rutas de los agentes

const clienteRutas = require('./rutas/clienteRutas');  // importamos las rutas de los clientes
app.use('/api/clientes', clienteRutas);  // manejamos las rutas de los clientes

// iniciar el servidor -----------------------------------
app.listen(app.get('puerto'), () => {
    console.log('servidor corriendo en el puerto', app.get('puerto'));  // mostramos en consola en qué puerto está corriendo la app
});
