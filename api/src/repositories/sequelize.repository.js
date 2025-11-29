const DatabaseInterface = require('../interfaces/database.interface');
const { UserEntity } = require('../models');
const User = require('../models/user.model');

/**
 * Implementación concreta del repositorio usando Sequelize
 * Implementa DatabaseInterface siguiendo el principio de Inversión de Dependencias
 */
class SequelizeRepository extends DatabaseInterface {
  constructor() {
    super();
    this.sequelize = require('../utils/sequelize.config');
  }

  /**
   * Busca un usuario por su ID
   * @param {number} id - ID del usuario a buscar
   * @returns {Promise<Array>} Array con el usuario si existe, array vacío si no existe
   */
  async findUserById(id) {
    try {
      const user = await User.findByPk(parseInt(id));

      // Retorna array con el usuario si existe, array vacío si no existe
      if (user) {
        const userEntity = UserEntity.fromSequelize(user);
        return [userEntity.toJSON()];
      }
      return [];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      // En caso de error, retornar array vacío
      return [];
    }
  }

  /**
   * Cierra la conexión a la base de datos
   * @returns {Promise<void>}
   */
  async disconnect() {
    await this.sequelize.close();
  }
}

module.exports = SequelizeRepository;

