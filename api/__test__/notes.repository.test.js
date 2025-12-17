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
});

