// función para obtener todos los agentes
const obtenerAgentes = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });

        conn.query('SELECT * FROM agentes', (err, agentes) => {
            if (err) return res.status(500).json({ error: 'Error al obtener los agentes' });
            res.json({ mensaje: 'Agentes encontrados', agentes });  // devuelve todos los agentes
        });
    });
};

// función para obtener un agente por su id
const obtenerAgente = (req, res) => {
    const { id } = req.params;  // obtenemos el id del agente desde los parámetros

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });

        conn.query('SELECT * FROM agentes WHERE id = ?', [id], (err, agente) => {
            if (err) return res.status(500).json({ error: 'Error al obtener el agente' });
            if (agente.length === 0) return res.status(404).json({ error: 'Agente no encontrado' });
            res.json({ mensaje: 'Agente encontrado', agente: agente[0] });  // devuelve el agente encontrado
        });
    });
};

// función para crear un nuevo agente
const crearAgente = (req, res) => {
    const { nombre, telefono, correo } = req.body;

    // si falta algún campo, responde con error
    if (!nombre || !telefono || !correo) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    console.log('Datos recibidos para crear agente:', req.body);  // para depurar

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });

        const nuevoAgente = { nombre, telefono, correo };

        // inserta el nuevo agente en la base de datos
        conn.query('INSERT INTO agentes SET ?', [nuevoAgente], (err, result) => {
            if (err) {
                console.error('Error al insertar agente:', err);
                return res.status(500).json({ error: 'Error al crear el agente' });
            }

            res.status(201).json({
                mensaje: 'Agente creado exitosamente',
                agente: { id: result.insertId, ...nuevoAgente }  // devuelve el agente con el id generado
            });
        });
    });
};

// función para actualizar un agente existente
const actualizarAgente = (req, res) => {
    const { id } = req.params;  // obtenemos el id desde los parámetros
    const { nombre, telefono, correo } = req.body;

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });

        conn.query('UPDATE agentes SET ? WHERE id = ?', [req.body, id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar el agente' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Agente no encontrado' });
            res.json({ mensaje: 'Agente actualizado exitosamente' });  // responde con éxito
        });
    });
};

// función para eliminar un agente por id
const eliminarAgente = (req, res) => {
    const { id } = req.params;  // obtenemos el id desde los parámetros

    req.getConnection((err, conn) => {
        if (err) return res.status(500).json({ error: 'Error de conexión a la base de datos' });

        conn.query('DELETE FROM agentes WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al eliminar el agente' });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Agente no encontrado' });
            res.json({ mensaje: 'Agente eliminado exitosamente' });  // responde con éxito
        });
    });
};

module.exports = {
    obtenerAgentes,
    obtenerAgente,
    crearAgente,
    actualizarAgente,
    eliminarAgente
};
