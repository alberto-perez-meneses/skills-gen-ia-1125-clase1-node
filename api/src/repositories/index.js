const SequelizeRepository = require('./sequelize.repository');

/**
 * Factory para crear instancias del repositorio según configuración
 * Permite cambiar fácilmente entre diferentes implementaciones de base de datos
 */
class RepositoryFactory {
  /**
   * Crea una instancia del repositorio según la configuración
   * Por defecto usa SequelizeRepository
   * @param {string} type - Tipo de repositorio ('sequelize', etc.)
   * @returns {DatabaseInterface} Instancia del repositorio
   */
  static create(type = 'sequelize') {
    switch (type.toLowerCase()) {
      case 'sequelize':
        return new SequelizeRepository();
      // Aquí se pueden agregar otras implementaciones:
      // case 'postgres':
      //   return new PostgresRepository();
      // case 'mongodb':
      //   return new MongoRepository();
      default:
        return new SequelizeRepository();
    }
  }
}

module.exports = RepositoryFactory;

