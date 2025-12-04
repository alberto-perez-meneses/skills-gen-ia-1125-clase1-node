/**
 * Configura el manejo graceful de señales para cerrar la conexión a la base de datos
 * @param {Object} repository - Instancia del repositorio que implementa el método disconnect()
 */
function setupGracefulShutdown(repository) {
    // Manejar cierre graceful de la aplicación
    process.on('SIGINT', async () => {
        console.log('\nClosing database connection...');
        await repository.disconnect();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\nClosing database connection...');
        await repository.disconnect();
        process.exit(0);
    });
}

module.exports = { setupGracefulShutdown };



