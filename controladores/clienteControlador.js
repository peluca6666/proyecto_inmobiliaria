const crearCliente = (req, res) => {
    const { nombre, correo, telefono, tipo_interes, mensaje } = req.body;

    // depuración: ver qué datos están llegando
    console.log('Datos recibidos:', {
        nombre,
        correo,
        telefono,
        tipo_interes,
        mensaje
    });

    // validación de campos requeridos
    if (!nombre || !correo || !tipo_interes) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }


    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        const nuevoCliente = {
            nombre,
            correo,
            telefono: telefono || null,
            tipo_interes
        };

        // depuración: ver el objeto que se intenta insertar
        console.log('Intentando insertar:', nuevoCliente);

        conn.query('INSERT INTO clientes SET ?', [nuevoCliente], (err, result) => {
            if (err) {
                console.error('Error detallado al insertar cliente:', err);
                return res.status(500).json({
                    error: 'Error al crear el cliente',
                    detalles: err.message
                });
            }

            res.status(201).json({
                mensaje: 'Cliente creado exitosamente',
                cliente: { id: result.insertId, ...nuevoCliente }
            });
        });
    });
};

const obtenerClientes = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        conn.query('SELECT * FROM clientes', (err, clientes) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener los clientes' });
            }
            res.json({ mensaje: 'Clientes encontrados', clientes });
        });
    });
};

const obtenerCliente = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        conn.query('SELECT * FROM clientes WHERE id = ?', [id], (err, cliente) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener el cliente' });
            }
            if (cliente.length === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            res.json({ mensaje: 'Cliente encontrado', cliente: cliente[0] });
        });
    });
};

const actualizarCliente = (req, res) => {
    const { id } = req.params;
    const { nombre, correo, telefono, tipo_interes } = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        conn.query('UPDATE clientes SET ? WHERE id = ?', [req.body, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el cliente' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            res.json({ mensaje: 'Cliente actualizado exitosamente' });
        });
    });
};

const eliminarCliente = (req, res) => {
    const { id } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json({ error: 'Error de conexión a la base de datos' });
        }

        conn.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar el cliente' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            res.json({ mensaje: 'Cliente eliminado exitosamente' });
        });
    });
};

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente
};
