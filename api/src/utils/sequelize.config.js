const { Sequelize } = require('sequelize');
const { getDatabaseUrl } = require('./database.config');

/**
 * Configuración de conexión Sequelize
 * Construye la conexión desde las variables de entorno
 */
function createSequelizeConnection() {
  // Si DATABASE_URL ya está definida, usarla directamente
  let databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    databaseUrl = getDatabaseUrl();
  }

  // Parsear la URL de conexión
  const url = new URL(databaseUrl);
  
  const sequelize = new Sequelize(
    url.pathname.substring(1), // nombre de la base de datos (sin el / inicial)
    url.username,
    url.password,
    {
      host: url.hostname,
      port: url.port || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

  return sequelize;
}

// Crear y exportar la instancia de Sequelize
const sequelize = createSequelizeConnection();

module.exports = sequelize;

