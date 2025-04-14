const express = require('express');
const router = express.Router();
const agenteControlador = require('../controladores/agenteControlador');

// cuando alguien haga una petición GET a la ruta raiz, obtenemos todos los agentes
router.get('/', agenteControlador.obtenerAgentes);

// cuando alguien pida un agente por su ID, lo buscamos con el ID que nos pasen
router.get('/:id', agenteControlador.obtenerAgente);

// si alguien quiere crear un nuevo agente, usamos este endpoint con POST
router.post('/', agenteControlador.crearAgente);

// cuando necesitemos actualizar los datos de un agente, usamos PUT y pasamos su ID
router.put('/:id', agenteControlador.actualizarAgente);

// si queremos eliminar un agente, usamos DELETE pasando su ID
router.delete('/:id', agenteControlador.eliminarAgente);

module.exports = router;  
