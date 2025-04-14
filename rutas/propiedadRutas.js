const express = require('express');  // importamos express para manejar las rutas
const router = express.Router();    // creamos un router para organizar las rutas de las propiedades
const propiedadControlador = require('../controladores/propiedadControlador');  // importamos el controlador para manejar las propiedades
const subirImagen = require('../middleware/subirImagen');  // importamos el middleware para subir imágenes

// obtener todas las propiedades
router.get('/', propiedadControlador.obtenerPropiedades);

// ruta para buscar propiedades, podría ser con filtros u otros parámetros
router.get('/buscar', propiedadControlador.buscarPropiedades);

// obtener propiedades por el ID de un agente
router.get('/agente/:id_agente', propiedadControlador.obtenerPropiedadesPorAgente);

// obtener una propiedad por su código
router.get('/:codigo', (req, res) => {
    req.getConnection((err, conn) => {
        // si hubo un error de conexión, devolvemos un error
        if (err) return res.status(500).json({ error: 'error de conexion' });

        // ejecutamos la consulta para obtener la propiedad usando el código
        conn.query('SELECT * FROM propiedades WHERE codigo_propiedad = ?',
            [req.params.codigo],  // el parámetro es el código de la propiedad
            (err, propiedad) => {
                // si hubo un error en la consulta, devolvemos un error
                if (err) return res.status(500).json({ error: 'error en la consulta' });

                // si no encontramos la propiedad, devolvemos un error 404
                if (propiedad.length === 0) return res.status(404).json({ error: 'propiedad no encontrada' });

                // si encontramos la propiedad, la devolvemos en la respuesta
                res.json(propiedad[0]);
            }
        );
    });
});

// crear una nueva propiedad
router.post('/', propiedadControlador.crearPropiedad);

// actualizar una propiedad usando su código
router.put('/:codigo', (req, res) => {
    req.getConnection((err, conn) => {
        // si hubo un error de conexión, devolvemos un error
        if (err) return res.status(500).json({ error: 'error de conexion' });

        // sacamos los datos de la propiedad desde el cuerpo de la solicitud
        const { tipo, direccion, precio, descripcion, estado, id_agente } = req.body;

        // si faltan campos requeridos, devolvemos un error 400
        if (!tipo || !direccion || !precio || !id_agente) {
            return res.status(400).json({
                error: 'faltan campos requeridos',
                camposRequeridos: ['tipo', 'direccion', 'precio', 'id_agente']
            });
        }

        // armamos el objeto con la propiedad actualizada
        const propiedadActualizada = {
            tipo,
            direccion,
            precio,
            descripcion,
            estado: estado || 'disponible',
            id_agente
        };

        // ejecutamos la consulta para actualizar la propiedad
        conn.query('UPDATE propiedades SET ? WHERE codigo_propiedad = ?',
            [propiedadActualizada, req.params.codigo],  // pasamos el objeto con los datos y el código de la propiedad
            (err, result) => {
                // si hubo un error al actualizar, devolvemos un error
                if (err) return res.status(500).json({ error: 'error al actualizar la propiedad' });

                // si no se actualizó ninguna propiedad, devolvemos un error 404
                if (result.affectedRows === 0) return res.status(404).json({ error: 'propiedad no encontrada' });

                // si la actualización fue exitosa, devolvemos un mensaje de éxito
                res.json({ mensaje: 'propiedad actualizada exitosamente' });
            }
        );
    });
});

// eliminar una propiedad usando su código
router.delete('/:codigo', (req, res) => {
    req.getConnection((err, conn) => {
        // si hubo un error de conexión, devolvemos un error
        if (err) return res.status(500).json({ error: 'error de conexion' });

        // ejecutamos la consulta para eliminar la propiedad usando el código
        conn.query('DELETE FROM propiedades WHERE codigo_propiedad = ?',
            [req.params.codigo],  // el parametro es el codigo de la propiedad
            (err, result) => {
                // si hubo un error al eliminar, devolvemos un error
                if (err) return res.status(500).json({ error: 'error al eliminar la propiedad' });

                // si no se eliminó ninguna propiedad, devolvemos un error 404
                if (result.affectedRows === 0) return res.status(404).json({ error: 'propiedad no encontrada' });

                // si la eliminación fue exitosa, devolvemos un mensaje de éxito
                res.json({ mensaje: 'propiedad eliminada exitosamente' });
            }
        );
    });
});

// rutas para las imagenes de las propiedades
router.post(
    '/:codigo_propiedad/imagenes',
    subirImagen.array('imagenes', 5),  // maximo 5 imagenes por carga
    propiedadControlador.subirImagenesPropiedad  // usamos el controlador para manejar la subida de imágenes
);

router.get(
    '/:codigo_propiedad/imagenes',
    propiedadControlador.obtenerImagenesPropiedad  // usamos el controlador para obtener las imagenes de la propiedad
);

module.exports = router; 
