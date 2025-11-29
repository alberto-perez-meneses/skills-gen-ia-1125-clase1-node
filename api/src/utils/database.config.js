/**
 * Utilidad para configurar la URL de conexión de la base de datos
 * Construye DATABASE_URL desde las variables de entorno del docker-compose
 */
function getDatabaseUrl() {
  // Si DATABASE_URL ya está definida, usarla directamente
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Construir DATABASE_URL desde las variables de entorno del docker-compose
  const dbHost = process.env.DB_HOST || 'mysql';
  const dbPort = process.env.DB_PORT || '3306';
  const dbUser = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'mydb';

  return `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

module.exports = { getDatabaseUrl };

