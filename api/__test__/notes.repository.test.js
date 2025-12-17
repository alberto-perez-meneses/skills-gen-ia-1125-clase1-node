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
});

