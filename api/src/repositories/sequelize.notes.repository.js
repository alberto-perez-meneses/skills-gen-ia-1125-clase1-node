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

  /**
   * Obtiene todas las notas de la base de datos
   * @returns {Promise<Array<Object>>} Array de objetos planos representando las notas
   */
  async getAllNotes() {
    const sequelizeNotes = await Note.findAll();
    
    return sequelizeNotes.map(sequelizeNote => {
      const noteEntity = NoteEntity.fromSequelize(sequelizeNote);
      return noteEntity.toJSON();
    });
  }

  /**
   * Actualiza una nota existente en la base de datos
   * @param {number} id - ID de la nota a actualizar
   * @param {{ title: string, content?: string }} noteData
   * @returns {Promise<Object|null>} Objeto plano representando la nota actualizada, o null si no existe
   */
  async updateNote(id, { title, content }) {
    const sequelizeNote = await Note.findByPk(id);
    
    if (!sequelizeNote) {
      return null;
    }

    const updatedNote = await sequelizeNote.update({
      title,
      content
    });

    const noteEntity = NoteEntity.fromSequelize(updatedNote);
    return noteEntity.toJSON();
  }
}

module.exports = SequelizeNotesRepository;

