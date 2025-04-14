// funcion para manejar errores de base de datos
const handleDatabaseError = (res, operation) => (err) => {
    return res.status(500).json({
        error: `Error al ${operation}`,
        detalles: err.message
    });
};

// funcion para ejecutar queries a la base de datos
const executeQuery = (req, query, params = []) => {
    return new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) reject(err);
            conn.query(query, params, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    });
};

// obtiene todas las propiedades de la base de datos
const obtenerPropiedades = async (req, res) => {
    try {
        const propiedades = await executeQuery(req, 'SELECT * FROM propiedades');
        res.json({
            mensaje: 'Propiedades encontradas',
            cantidad: propiedades.length,
            propiedades
        });
    } catch (err) {
        handleDatabaseError(res, 'obtener las propiedades')(err);
    }
};

// crea una nueva propiedad en la base de datos
const crearPropiedad = async (req, res) => {
    const { tipo, direccion, precio, descripcion, estado, id_agente } = req.body;

    // verifica que los campos obligatorios estén presentes
    if (!tipo || !direccion || !precio || !id_agente) {
        return res.status(400).json({
            error: 'Faltan campos requeridos',
            camposRequeridos: ['tipo', 'direccion', 'precio', 'id_agente']
        });
    }

    // genera un código único para la propiedad
    const codigo_propiedad = 'PROP-' + Date.now();

    try {
        const nuevaPropiedad = {
            codigo_propiedad,
            tipo,
            direccion,
            precio,
            descripcion: descripcion || '',
            estado: estado || 'disponible',
            id_agente
        };

        const result = await executeQuery(req, 'INSERT INTO propiedades SET ?', [nuevaPropiedad]);

        res.status(201).json({
            mensaje: 'Propiedad creada exitosamente',
            propiedad: { ...nuevaPropiedad, id: result.insertId }
        });
    } catch (err) {
        handleDatabaseError(res, 'crear la propiedad')(err);
    }
};

// obtiene las propiedades asociadas a un agente específico
const obtenerPropiedadesPorAgente = async (req, res) => {
    const { id_agente } = req.params;

    try {
        const propiedades = await executeQuery(
            req,
            'SELECT * FROM propiedades WHERE id_agente = ?',
            [id_agente]
        );

        if (propiedades.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron propiedades para este agente'
            });
        }

        res.json({ mensaje: 'Propiedades encontradas', propiedades });
    } catch (err) {
        handleDatabaseError(res, 'obtener las propiedades del agente')(err);
    }
};

// sube imagenes asociadas a una propiedad específica
const subirImagenesPropiedad = async (req, res) => {
    const { codigo_propiedad } = req.params;

    if (!req.files?.length) {
        return res.status(400).json({ error: 'No se han proporcionado imágenes' });
    }

    try {
        // busca la propiedad por su código
        const resultados = await executeQuery(
            req,
            'SELECT id FROM propiedades WHERE codigo_propiedad = ?',
            [codigo_propiedad]
        );

        if (!resultados.length) {
            return res.status(404).json({
                error: 'Propiedad no encontrada',
                codigo: codigo_propiedad
            });
        }

        const id_propiedad = resultados[0].id;
        const imagenesParaInsertar = req.files.map(file =>
            [id_propiedad, `/imagenes/propiedades/${file.filename}`]
        );

        await executeQuery(
            req,
            'INSERT INTO imagenes_propiedades (id_propiedad, ruta_imagen) VALUES ?',
            [imagenesParaInsertar]
        );

        res.json({
            mensaje: 'Imágenes subidas exitosamente',
            cantidad: req.files.length,
            propiedad: codigo_propiedad,
            imagenes: imagenesParaInsertar.map(img => ({ ruta_imagen: img[1] }))
        });
    } catch (err) {
        handleDatabaseError(res, 'subir las imágenes')(err);
    }
};

// obtiene todas las imágenes asociadas a una propiedad
const obtenerImagenesPropiedad = async (req, res) => {
    const { codigo_propiedad } = req.params;

    try {
        const imagenes = await executeQuery(
            req,
            `SELECT i.* FROM imagenes_propiedades i 
             INNER JOIN propiedades p ON i.id_propiedad = p.id 
             WHERE p.codigo_propiedad = ?`,
            [codigo_propiedad]
        );

        res.json({
            mensaje: 'Imágenes encontradas',
            cantidad: imagenes.length,
            imagenes
        });
    } catch (err) {
        handleDatabaseError(res, 'obtener las imágenes')(err);
    }
};

// busca propiedades aplicando filtros opcionales
const buscarPropiedades = async (req, res) => {
    const { precio_min, precio_max, ubicacion, tipo, estado } = req.query;
    let query = 'SELECT * FROM propiedades WHERE 1=1';
    const params = [];

    // construye la query dinamicamente según los filtros proporcionados
    if (precio_min) {
        query += ' AND precio >= ?';
        params.push(parseFloat(precio_min));
    }

    if (precio_max) {
        query += ' AND precio <= ?';
        params.push(parseFloat(precio_max));
    }

    if (ubicacion) {
        query += ' AND direccion LIKE ?';
        params.push(`%${ubicacion}%`);
    }

    if (tipo) {
        query += ' AND tipo = ?';
        params.push(tipo);
    }

    if (estado) {
        query += ' AND estado = ?';
        params.push(estado);
    }

    try {
        const propiedades = await executeQuery(req, query, params);

        res.json({
            mensaje: 'Propiedades encontradas',
            cantidad: propiedades.length,
            filtros_aplicados: { precio_min, precio_max, ubicacion, tipo, estado },
            propiedades
        });
    } catch (err) {
        handleDatabaseError(res, 'buscar propiedades')(err);
    }
};

module.exports = {
    obtenerPropiedades,
    crearPropiedad,
    subirImagenesPropiedad,
    obtenerImagenesPropiedad,
    obtenerPropiedadesPorAgente,
    buscarPropiedades
}; 