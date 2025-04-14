Resumen de la API de Propiedades
Esta API permite gestionar propiedades inmobiliarias. Con ella, podemos hacer operaciones como crear, leer, actualizar y eliminar propiedades, además de subir y obtener imágenes asociadas a esas propiedades.

Rutas (Endpoints) disponibles

Obtener todas las propiedades
Método: GET
Ruta: /propiedades
Respuesta: Te devuelve un listado con todas las propiedades

Buscar propiedades con filtros
Método: GET
Ruta: /propiedades/buscar
Parámetros opcionales:
precio_min: precio mínimo
precio_max: precio máximo
ubicacion: ubicación
tipo: tipo de propiedad (ej. Casa, Departamento)
estado: estado de la propiedad (ej. Disponible, Vendida)
Ejemplo: /propiedades/buscar?precio_min=100000&ubicacion=Palermo

Obtener propiedades por agente
Método: GET
Ruta: /propiedades/agente/:id_agente
Respuesta: Devuelve las propiedades asociadas a un agente en específico

Crear una nueva propiedad
Método: POST
Ruta: /propiedades
Datos requeridos:
tipo: tipo de propiedad
direccion: dirección de la propiedad
precio: precio de la propiedad
id_agente: ID del agente encargado
descripcion: descripción (opcional)
estado: estado de la propiedad (opcional)

Actualizar una propiedad
Método: PUT
Ruta: /propiedades/:codigo
Datos actualizables: Se puede actualizar cualquier dato que se haya enviado al crear la propiedad

Eliminar una propiedad
Método: DELETE
Ruta: /propiedades/:codigo
Descripción: Elimina la propiedad indicada por el código

Gestión de Imágenes
Subir imágenes
Método: POST
Ruta: /propiedades/:codigo_propiedad/imagenes
Formato: Debe ser multipart/form-data y puede incluir hasta 5 archivos de imagen
Obtener imágenes
Método: GET
Ruta: /propiedades/:codigo_propiedad/imagenes
Descripción: Obtiene las imágenes de una propiedad
Códigos de Estado
200: Solicitud exitosa
201: Recurso creado con éxito
400: Error en la solicitud (faltan o son incorrectos los datos)
404: Recurso no encontrado
500: Error interno del servidor

Ejemplo de uso con Postman

Crear una propiedad:
Método: POST
URL: http://[servidor]/propiedades
Body (raw JSON):
json
{
    "tipo": "Departamento",
    "direccion": "Av. Santa Fe 4321",
    "precio": 200000,
    "descripcion": "Hermoso depto en Recoleta",
    "id_agente": 1
}

Buscar propiedades por zona:
Método: GET
URL: http://[servidor]/propiedades/buscar?ubicacion=Recoleta&precio_max=250000
    
----------------------------------------------------------------------------------------------------

Resumen de la API de clientes

Está diseñada para gestionar clientes inmobiliarios. Permite hacer operaciones CRUD sobre los clientes, así como gestionar los formularios de contacto que los clientes puedan llenar

Endpoints disponibles

Crear un cliente
Método: POST
Ruta: /clientes
Datos requeridos:
nombre: Nombre completo del cliente
correo: Correo electrónico
tipo_interes: Tipo de interés del cliente (Compra, Alquiler, etc.)
telefono: Teléfono (opcional)
Respuesta: Devuelve un mensaje confirmando la creación del cliente junto con sus datos

Obtener todos los clientes
Método: GET
Ruta: /clientes
Respuesta: Devuelve un listado de todos los clientes registrados

Obtener un cliente específico
Método: GET
Ruta: /clientes/:id
Respuesta: Devuelve los datos de un cliente específico según su ID

Actualizar los datos de un cliente
Método: PUT
Ruta: /clientes/:id
Datos actualizables:
nombre: Nombre completo
correo: Correo electrónico
telefono: Teléfono
tipo_interes: Tipo de interés (Compra, Alquiler, etc.)
Respuesta: Actualiza los datos del cliente y devuelve los nuevos valores

Eliminar un cliente
Método: DELETE
Ruta: /clientes/:id
Descripción: Elimina un cliente especificado por su ID

Formulario de contacto

Método: POST
Ruta: /clientes/contact
Datos requeridos:
nombre: Nombre del cliente
email: Correo electrónico
tipoInteres: Tipo de interés (Venta, Alquiler, etc.)
telefono: Teléfono (opcional)
message: Mensaje de consulta
Respuesta: Los mensajes se almacenan en la base de datos para futuras consultas
Códigos de Estado
200: Solicitud exitosa
201: Cliente creado exitosamente
400: Faltan datos requeridos
404: Cliente no encontrado
500: Error del servidor

Ejemplo de uso con Postman

Crear un cliente:
Método: POST
URL: http://[servidor]/clientes
Body (raw JSON):
json
{
    "nombre": "Carlos Gómez",
    "correo": "carlos@ejemplo.com",
    "telefono": "1155667788",
    "tipo_interes": "Alquiler"
}

Actualizar un cliente:
Método: PUT
URL: http://[servidor]/clientes/1
Body (raw JSON):
json
{
    "telefono": "1199887766",
    "tipo_interes": "Compra"
}

----------------------------------------------------------------------------------------------------

Resumen de la API de Agentes
Esta API está diseñada para gestionar los agentes inmobiliarios. Permite realizar operaciones CRUD sobre los agentes

Endpoints disponibles

Crear un Agente
Método: POST
Ruta: /agentes
Datos requeridos:
nombre: Nombre completo del agente
telefono: Teléfono del agente
correo: Correo electrónico del agente
Respuesta: Devuelve un mensaje confirmando la creación del agente junto con sus datos

Obtener todos los Agentes
Método: GET
Ruta: /agentes
Respuesta: Devuelve un listado de todos los agentes registrados

Obtener un Agente específico
Método: GET
Ruta: /agentes/:id
Respuesta: Devuelve los datos de un agente específico según su ID

Actualizar los datos de un Agente
Método: PUT
Ruta: /agentes/:id
Datos actualizables:
nombre: Nombre completo
telefono: Teléfono
correo: Correo electrónico
Respuesta: Actualiza los datos del agente y devuelve un mensaje de éxito

Eliminar un Agente
Método: DELETE
Ruta: /agentes/:id
Respuesta: Elimina un agente especificado por su ID.
Códigos de Estado
200: Solicitud exitosa
201: Agente creado exitosamente
400: Faltan datos requeridos
404: Agente no encontrado
500: Error del servidor

Ejemplo de Uso con Postman
Crear un Agente:
Método: POST
URL: http://[tu-servidor]/agentes
Body (raw JSON):
json
{
    "nombre": "Martín González",
    "telefono": "1144556677",
    "correo": "martin@inmobiliaria.com"
}

Actualizar datos de un Agente:
Método: PUT
URL: http://[servidor]/agentes/1
Body (raw JSON):
json

{
    "telefono": "1144556688",
    "correo": "martin.gonzalez@inmobiliaria.com"
}

-----------------------------------------------------------------------------------------------------

Como interactuar con la API usando Postman

1-  Crear una Colección en Postman
Abrir Postman y buscar la opción "New" -> "Collection"
Nombrar la colección como "API Clientes" para organizar las solicitudes
---------------------------
2- Configurar el Entorno
Crear un nuevo "Environment" (entorno) en Postman.
Añadir una variable llamada BASE_URL con la URL de tu servidor, por ejemplo: http://[servidor]
---------------------------
3- Realizar Peticiones a la API

Crear un Cliente (POST):
Abrir una nueva solicitud (request).
Seleccionar el método POST y utilizar la URL {{BASE_URL}}/clientes.
En el cuerpo (Body), añadir los datos del cliente en formato JSON. Ejemplo:
json
{
    "nombre": "Juan Pérez",
    "correo": "juan@ejemplo.com",
    "tipo_interes": "Compra",
    "telefono": "1122334455"
}

Obtener Todos los Clientes (GET):
Abrir una nueva solicitud.
Seleccionar el método GET y utilizar la URL {{BASE_URL}}/clientes para obtener todos los clientes.

Obtener un Cliente Específico (GET):
Abrir una nueva solicitud.
Seleccionar el método GET y utilizar la URL {{BASE_URL}}/clientes/:id, reemplazando :id por el ID del cliente que deseas consultar
.
Actualizar un Cliente (PUT):
Abrir una nueva solicitud
Seleccionar el método PUT y utilizar la URL {{BASE_URL}}/clientes/:id, reemplazando :id por el ID del cliente a actualizar.
En el cuerpo (Body), añadir los datos actualizados en formato JSON.

Eliminar un Cliente (DELETE):
Abrir una nueva solicitud.
Seleccionar el método DELETE y utilizar la URL {{BASE_URL}}/clientes/:id para eliminar un cliente.
---------------------------
4- Comprobaciones

Crear Cliente:
Ejecutar la solicitud de creación.
Verificar que la respuesta tenga el código de estado 201 (creado) y guardar el ID del cliente creado.

Actualizar Cliente:
Usar el ID guardado y ejecutar la solicitud de actualización.
Verificar que la respuesta tenga un código de estado 200 

Eliminar Cliente:
Usar el ID guardado y ejecutar la solicitud de eliminación
Verificar que la respuesta tenga un código de estado 200