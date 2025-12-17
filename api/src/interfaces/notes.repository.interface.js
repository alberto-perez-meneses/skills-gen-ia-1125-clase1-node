/**
 * Interfaz abstracta para operaciones de base de datos relacionadas con notas
 * Forma parte de la capa de repositorio desacoplada de la infraestructura
 */
class NotesRepositoryInterface {
  /**
   * Crea una nueva nota
   * @param {{ title: string, content?: string }} noteData
   * @returns {Promise<Object>} Objeto plano con al menos id, title, content, created_at, updated_at
   */
  async createNote(noteData) {
    throw new Error('createNote must be implemented by subclass');
  }

  /**
   * Obtiene todas las notas
   * @returns {Promise<Array<Object>>} Array de objetos planos con id, title, content, created_at, updated_at
   */
  async getAllNotes() {
    throw new Error('getAllNotes must be implemented by subclass');
  }

  /**
   * Actualiza una nota existente
   * @param {number} id - ID de la nota a actualizar
   * @param {{ title: string, content?: string }} noteData
   * @returns {Promise<Object|null>} Objeto plano con id, title, content, created_at, updated_at, o null si no existe
   */
  async updateNote(id, noteData) {
    throw new Error('updateNote must be implemented by subclass');
  }
}

module.exports = NotesRepositoryInterface;

