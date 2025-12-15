const NotesRepositoryInterface = require('../interfaces/notes.repository.interface');
const Note = require('../models/note.model');
const { NoteEntity } = require('../models');

/**
 * Implementación del repositorio de notas usando Sequelize
 * Sigue el principio de Inversión de Dependencias mediante NotesRepositoryInterface
 */
class SequelizeNotesRepository extends NotesRepositoryInterface {
  /**
   * Crea una nueva nota en la base de datos
   * @param {{ title: string, content?: string }} noteData
   * @returns {Promise<Object>} Objeto plano representando la nota creada
   */
  async createNote({ title, content }) {
    const sequelizeNote = await Note.create({
      title,
      content
    });

    const noteEntity = NoteEntity.fromSequelize(sequelizeNote);
    return noteEntity.toJSON();
  }
}

module.exports = SequelizeNotesRepository;

