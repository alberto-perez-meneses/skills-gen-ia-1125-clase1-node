/**
 * Interfaz abstracta para operaciones de base de datos
 * Siguiendo el principio de Inversión de Dependencias (DIP)
 * 
 * Esta interfaz define el contrato que deben cumplir todas las implementaciones
 * de repositorios de base de datos, permitiendo cambiar la implementación
 * sin afectar el código que la utiliza.
 */
class DatabaseInterface {
  /**
   * Busca un usuario por su ID
   * @param {number} id - ID del usuario a buscar
   * @returns {Promise<Array>} Array con el usuario si existe, array vacío si no existe
   */
  async findUserById(id) {
    throw new Error('findUserById must be implemented by subclass');
  }

  /**
   * Cierra la conexión a la base de datos
   * @returns {Promise<void>}
   */
  async disconnect() {
    throw new Error('disconnect must be implemented by subclass');
  }
}

module.exports = DatabaseInterface;

