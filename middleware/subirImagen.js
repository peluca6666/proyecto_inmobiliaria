const multer = require('multer');
const path = require('path');

// configuramos como y donde guardar las imágenes
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        // guardamos las imágenes en la carpeta 'imagenes/propiedades'
        cb(null, 'imagenes/propiedades');
    },
    filename: (req, file, cb) => {
        // creamos un nombre unico para cada archivo
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, nombreUnico);
    }
});

// filtramos los tipos de archivo permitidos
const filtroArchivo = (req, file, cb) => {
    // Solo permitimos imagenes
    if (file.mimetype.startsWith('image')) {
        cb(null, true);  // Si es una imagen, lo aceptamos
    } else {
        cb(new Error('El archivo debe ser una imagen'), false);  // si no es imagen, mostramos un error
    }
};

// configuramos multer para subir las imágenes con las restricciones
const subirImagen = multer({
    storage: almacenamiento,
    fileFilter: filtroArchivo, // este filtro nos sirve para solo aceptar imágenes
    limits: {
        fileSize: 5 * 1024 * 1024,  // limitamos el tamaño del archivo a 5 mb
    }
});

module.exports = subirImagen;  
