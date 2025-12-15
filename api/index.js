const express = require('express')
const expressJsDocSwagger = require('express-jsdoc-swagger');
const app = express()
const port = 3000
const { reverseString, isValidId } = require('./lib/string');
const RepositoryFactory = require('./src/repositories');
const { setupGracefulShutdown } = require('./src/utils/graceful-shutdown');

// Middleware para parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Configuración de Swagger
const options = {
    info: {
        version: '1.0.0',
        title: 'API Example',
        description: 'API de ejemplo con documentación Swagger',
    },
    baseDir: __dirname,
    filesPattern: './**/*.js',
    swaggerUIPath: '/api-docs',
    exposeApiDocs: true,
    serverUrls: [`http://localhost:${port}`],
};

expressJsDocSwagger(app)(options);

// Crear instancias de repositorios usando Dependency Inversion
const userRepository = RepositoryFactory.create('sequelize');
const notesRepository = RepositoryFactory.create('sequelize-notes');

/**
 * Entidad Note para documentación Swagger
 * @typedef {object} Note
 * @property {number} id - Identificador de la nota
 * @property {string} title - Título de la nota
 * @property {string} content - Contenido de la nota
 * @property {string} createdAt - Fecha de creación de la nota
 */

/**
 * Payload de creación de nota
 * @typedef {object} NoteCreateRequest
 * @property {string} title.required - Título de la nota
 * @property {string} content - Contenido de la nota
 */

/**
 * GET /
 * @summary Endpoint raíz que retorna un saludo
 * @tags General
 * @return {string} 200 - Retorna "Hello World!"
 */
app.get('/', (req, res) => {
    res.send('Hello World!')
})

/**
 * GET /about/:id
 * @summary Obtiene información de un usuario por ID
 * @tags Users
 * @param {number} id.path.required - ID numérico del usuario (debe ser un entero)
 * @return {object} 200 - Usuario encontrado
 * @return {number} 200.id - ID del usuario
 * @return {string} 200.name - Nombre del usuario
 * @return {object} 400 - Error cuando el ID tiene formato inválido
 * @return {string} 400.error - Mensaje de error
 * @return {object} 404 - Error cuando el usuario no existe
 * @return {string} 404.error - Mensaje de error
 */
app.get('/about/:id', async (req, res) => {
    const userId = req.params.id;

    if (!isValidId(userId)) {
        res.status(400).send({ error: "Invalid id format" });
        return;
    }

    // Usar el repositorio para buscar el usuario en la base de datos
    const users = await userRepository.findUserById(parseInt(userId));

    // findUserById retorna un array: con datos si existe, vacío si no existe
    if (users.length === 0) {
        res.status(404).send({ error: "User not found" });
        return;
    }

    // Retornar el primer elemento del array (el usuario encontrado)
    res.send(users[0]);
})

/**
 * GET /reverse/:str
 * @summary Invierte una cadena de texto
 * @tags Utilities
 * @param {string} str.path.required - Cadena de texto a invertir
 * @return {object} 200 - Objeto con la cadena original e invertida
 * @return {string} 200.original - Cadena original
 * @return {string} 200.reversed - Cadena invertida
 */
app.get('/reverse/:str', (req, res) => {
    const str = req.params.str;
    const reversed = reverseString(str);
    res.send({ original: str, reversed: reversed });
});

/**
 * POST /api/notes
 * @summary Crea una nueva nota y la persiste en la base de datos
 * @tags Notes
 * @param {NoteCreateRequest} request.body.required - Datos de la nota a crear
 * @return {Note} 201 - Nota creada correctamente
 * @return {object} 400 - Error de validación cuando el título es inválido o inexistente
 * @return {string} 400.error - Mensaje de error de validación
 */
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body || {};

        // Validaciones para title según NOTES-BE-1
        if (
            typeof title !== 'string' ||
            title.trim().length === 0
        ) {
            return res.status(400).json({ error: 'Invalid title' });
        }

        const createdNote = await notesRepository.createNote({
            title: title.trim(),
            content
        });

        // Mapear created_at a createdAt según criterio del ticket
        const responseBody = {
            id: createdNote.id,
            title: createdNote.title,
            content: createdNote.content,
            createdAt: createdNote.created_at
        };

        return res.status(201).json(responseBody);
    } catch (error) {
        console.error('Error creating note:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Manejar cierre graceful de la aplicación
setupGracefulShutdown(userRepository);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

// Exportamos la app para usarla en los tests
module.exports = app;