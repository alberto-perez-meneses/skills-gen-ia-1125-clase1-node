/**
 * Entidad Note
 * Representa el modelo de dominio de una nota en la aplicación
 */
class NoteEntity {
  constructor({ id, title, content, created_at, updated_at }) {
    this.id = id;
    this.title = title;
    this.content = content;
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
      title: this.title,
      content: this.content,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Crea una instancia de NoteEntity desde un objeto de Sequelize
   * @param {Object} sequelizeNote - Objeto retornado por Sequelize
   * @returns {NoteEntity}
   */
  static fromSequelize(sequelizeNote) {
    if (!sequelizeNote) return null;
    let noteData;
    if (typeof sequelizeNote.toJSON === 'function') {
      noteData = sequelizeNote.toJSON();
    } else if (typeof sequelizeNote.get === 'function') {
      noteData = sequelizeNote.get({ plain: true });
    } else {
      noteData = sequelizeNote.dataValues || sequelizeNote;
    }

    return new NoteEntity({
      id: noteData.id,
      title: noteData.title,
      content: noteData.content,
      created_at: noteData.created_at,
      updated_at: noteData.updated_at
    });
  }
}

module.exports = NoteEntity;

