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
}

module.exports = NotesRepositoryInterface;

