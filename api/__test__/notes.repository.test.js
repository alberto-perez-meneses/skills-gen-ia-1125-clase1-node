const SequelizeNotesRepository = require('../src/repositories/sequelize.notes.repository');
const Note = require('../src/models/note.model');
const { NoteEntity } = require('../src/models');

jest.mock('../src/models/note.model');
jest.mock('../src/models', () => {
  const actualModels = jest.requireActual('../src/models');
  return {
    ...actualModels,
    NoteEntity: actualModels.NoteEntity
  };
});

describe('SequelizeNotesRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createNote debe crear una nota y devolver id y created_at', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    const mockCreatedAt = new Date();
    const mockNoteInstance = {
      toJSON: () => ({
        id: 1,
        title: 'Test note',
        content: 'Content',
        created_at: mockCreatedAt,
        updated_at: mockCreatedAt
      })
    };

    Note.create.mockResolvedValue(mockNoteInstance);

    // Act
    const result = await repo.createNote({ title: 'Test note', content: 'Content' });

    // Assert
    expect(Note.create).toHaveBeenCalledWith({
      title: 'Test note',
      content: 'Content'
    });
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('created_at');
  });

  test('getAllNotes debe retornar un array vacío cuando no hay notas', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    Note.findAll.mockResolvedValue([]);

    // Act
    const result = await repo.getAllNotes();

    // Assert
    expect(Note.findAll).toHaveBeenCalledWith();
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  test('getAllNotes debe retornar un array de notas cuando hay datos', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    const mockCreatedAt = new Date();
    const mockUpdatedAt = new Date();
    
    const mockNoteInstance1 = {
      toJSON: () => ({
        id: 1,
        title: 'Primera nota',
        content: 'Contenido de la primera nota',
        created_at: mockCreatedAt,
        updated_at: mockUpdatedAt
      })
    };

    const mockNoteInstance2 = {
      toJSON: () => ({
        id: 2,
        title: 'Segunda nota',
        content: 'Contenido de la segunda nota',
        created_at: mockCreatedAt,
        updated_at: mockUpdatedAt
      })
    };

    Note.findAll.mockResolvedValue([mockNoteInstance1, mockNoteInstance2]);

    // Act
    const result = await repo.getAllNotes();

    // Assert
    expect(Note.findAll).toHaveBeenCalledWith();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    
    // Verificar primera nota
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[0]).toHaveProperty('title', 'Primera nota');
    expect(result[0]).toHaveProperty('content', 'Contenido de la primera nota');
    expect(result[0]).toHaveProperty('created_at');
    expect(result[0]).toHaveProperty('updated_at');
    
    // Verificar segunda nota
    expect(result[1]).toHaveProperty('id', 2);
    expect(result[1]).toHaveProperty('title', 'Segunda nota');
    expect(result[1]).toHaveProperty('content', 'Contenido de la segunda nota');
    expect(result[1]).toHaveProperty('created_at');
    expect(result[1]).toHaveProperty('updated_at');
  });

  test('updateNote debe actualizar una nota existente y devolver la nota actualizada', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    const mockCreatedAt = new Date('2024-01-01');
    const mockUpdatedAt = new Date('2024-01-02');
    
    const mockUpdatedNoteInstance = {
      id: 1,
      title: 'Nota actualizada',
      content: 'Contenido actualizado',
      created_at: mockCreatedAt,
      updated_at: mockUpdatedAt,
      toJSON: jest.fn(() => ({
        id: 1,
        title: 'Nota actualizada',
        content: 'Contenido actualizado',
        created_at: mockCreatedAt,
        updated_at: mockUpdatedAt
      }))
    };

    const mockNoteInstance = {
      id: 1,
      title: 'Nota original',
      content: 'Contenido original',
      created_at: mockCreatedAt,
      updated_at: mockCreatedAt,
      update: jest.fn().mockResolvedValue(mockUpdatedNoteInstance)
    };

    Note.findByPk = jest.fn().mockResolvedValue(mockNoteInstance);

    // Act
    const result = await repo.updateNote(1, { 
      title: 'Nota actualizada', 
      content: 'Contenido actualizado' 
    });

    // Assert
    expect(Note.findByPk).toHaveBeenCalledWith(1);
    expect(mockNoteInstance.update).toHaveBeenCalledWith({
      title: 'Nota actualizada',
      content: 'Contenido actualizado'
    });
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('title', 'Nota actualizada');
    expect(result).toHaveProperty('content', 'Contenido actualizado');
    expect(result).toHaveProperty('updated_at');
    expect(Note.create).not.toHaveBeenCalled();
  });

  test('updateNote debe retornar null cuando el id no existe', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    Note.findByPk = jest.fn().mockResolvedValue(null);

    // Act
    const result = await repo.updateNote(999, { 
      title: 'Nota actualizada', 
      content: 'Contenido actualizado' 
    });

    // Assert
    expect(Note.findByPk).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
    expect(Note.create).not.toHaveBeenCalled();
  });

  test('updateNote debe lanzar error cuando title es vacío', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    const mockCreatedAt = new Date('2024-01-01');
    
    const mockNoteInstance = {
      id: 1,
      title: 'Nota original',
      content: 'Contenido original',
      created_at: mockCreatedAt,
      updated_at: mockCreatedAt,
      update: jest.fn().mockRejectedValue(new Error('Title cannot be empty'))
    };

    Note.findByPk = jest.fn().mockResolvedValue(mockNoteInstance);

    // Act & Assert
    await expect(
      repo.updateNote(1, { title: '', content: 'Contenido' })
    ).rejects.toThrow('Title cannot be empty');
    
    expect(Note.findByPk).toHaveBeenCalledWith(1);
    expect(mockNoteInstance.update).toHaveBeenCalledWith({
      title: '',
      content: 'Contenido'
    });
    expect(Note.create).not.toHaveBeenCalled();
  });

  test('updateNote debe lanzar error cuando title es inexistente', async () => {
    // Arrange
    const repo = new SequelizeNotesRepository();
    const mockCreatedAt = new Date('2024-01-01');
    
    const mockNoteInstance = {
      id: 1,
      title: 'Nota original',
      content: 'Contenido original',
      created_at: mockCreatedAt,
      updated_at: mockCreatedAt,
      update: jest.fn().mockRejectedValue(new Error('Title is required'))
    };

    Note.findByPk = jest.fn().mockResolvedValue(mockNoteInstance);

    // Act & Assert
    await expect(
      repo.updateNote(1, { content: 'Contenido sin título' })
    ).rejects.toThrow('Title is required');
    
    expect(Note.findByPk).toHaveBeenCalledWith(1);
    expect(mockNoteInstance.update).toHaveBeenCalledWith({
      content: 'Contenido sin título'
    });
    expect(Note.create).not.toHaveBeenCalled();
  });
});

