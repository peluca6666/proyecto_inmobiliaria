const express = require('express');
const router = express.Router();
const clienteControlador = require('../controladores/clienteControlador');

// rutas CRUD para manejar los clientes
router.post('/', clienteControlador.crearCliente);
router.get('/', clienteControlador.obtenerClientes);
router.get('/:id', clienteControlador.obtenerCliente);
router.put('/:id', clienteControlador.actualizarCliente);
router.delete('/:id', clienteControlador.eliminarCliente);

// ruta para manejar los datos que vienen del formulario de contacto
// aca guardamos los datos que un cliente envia en el formulario de contacto
router.post('/contact', async (req, res) => {
    // sacamos los datos que el cliente envió en el formulario
    const { nombre, email, telefono, tipoInteres, message } = req.body;

    try {
        // hacemos una consulta sql para guardar los datos en la base de datos
        const query = 'insert into clientes (nombre, correo, telefono, tipo_interes, mensaje) values (?, ?, ?, ?, ?)';
        const values = [nombre, email, telefono || null, tipoInteres, message];

        // ejecutamos la consulta en la base de datos
        await db.query(query, values);

        // si todo sale bien, devolvemos una respuesta exitosa
        res.json({ success: true, message: "datos almacenados exitosamente" });
    } catch (error) {
        // si ocurre un error, mostramos el error y enviamos una respuesta de fallo
        console.error('error al almacenar los datos:', error);
        res.status(500).json({ success: false, message: "hubo un error al almacenar los datos" });
    }
});

module.exports = router;  