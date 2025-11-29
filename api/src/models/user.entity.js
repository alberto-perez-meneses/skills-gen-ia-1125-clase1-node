/**
 * Entidad User
 * Representa el modelo de datos de un usuario en la aplicación
 */
class UserEntity {
  constructor({ id, name, email, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Crea una instancia de UserEntity desde un objeto de Sequelize
   * @param {Object} sequelizeUser - Objeto retornado por Sequelize
   * @returns {UserEntity}
   */
  static fromSequelize(sequelizeUser) {
    if (!sequelizeUser) return null;
    // Sequelize retorna instancias del modelo, usar toJSON() si está disponible
    // o get({ plain: true }) para obtener un objeto plano
    let userData;
    if (typeof sequelizeUser.toJSON === 'function') {
      userData = sequelizeUser.toJSON();
    } else if (typeof sequelizeUser.get === 'function') {
      userData = sequelizeUser.get({ plain: true });
    } else {
      // Fallback: usar dataValues o el objeto directamente
      userData = sequelizeUser.dataValues || sequelizeUser;
    }
    return new UserEntity({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at
    });
  }
}

module.exports = UserEntity;

