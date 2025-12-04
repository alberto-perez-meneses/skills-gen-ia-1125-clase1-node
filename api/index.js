const express = require('express')
const app = express()
const port = 3000
const { reverseString, isValidId } = require('./lib/string');
const RepositoryFactory = require('./src/repositories');
const { setupGracefulShutdown } = require('./src/utils/graceful-shutdown');

// Crear instancia del repositorio usando Dependency Inversion
const userRepository = RepositoryFactory.create('sequelize');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

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

app.get('/reverse/:str', (req, res) => {
    const str = req.params.str;
    const reversed = reverseString(str);
    res.send({ original: str, reversed: reversed });
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