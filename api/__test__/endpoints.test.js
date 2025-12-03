const request = require('supertest');

// MOCK: Reemplazamos completamente el RepositoryFactory antes de importar index.js
// Razón: Necesitamos interceptar la creación del repositorio para inyectar un mock
// en lugar de la implementación real de Sequelize que requiere conexión a BD
const mockRepository = {
    findUserById: jest.fn(), // STUB: Se configurará con datos fijos en cada test
    disconnect: jest.fn() // Mock para evitar llamadas reales de desconexión
};

jest.mock('../src/repositories', () => {
    // Creamos una clase mock que simula RepositoryFactory con método estático create
    class MockRepositoryFactory {
        static create() {
            return mockRepository; // Retorna siempre el mismo mock
        }
    }
    return MockRepositoryFactory;
});

// Importamos la app DESPUÉS del mock para que use el RepositoryFactory mockeado
const app = require('../index');

describe('API Endpoints', () => {
    // Setup: Limpiamos las llamadas del mock antes de cada test
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiamos llamadas anteriores
    });

    // Prueba para la ruta raíz
    test('GET / debe retornar Hello World!', async () => {
        // Arrange
        const route = '/';
        const expectedStatusCode = 200;
        const expectedText = 'Hello World!';
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.text).toBe(expectedText);
    });

    // Prueba para obtener un usuario existente
    test('GET /about/:id debe retornar un usuario existente (Alice)', async () => {
        // Arrange
        const userId = 1;
        const route = `/about/${userId}`;
        const expectedStatusCode = 200;
        const expectedUser = { id: 1, name: 'Alice' };
        
        // STUB: Configuramos findUserById para retornar datos fijos
        // Razón: Necesitamos datos predecibles sin ejecutar la lógica real de BD
        mockRepository.findUserById.mockResolvedValue([expectedUser]);
        
        // SPY: Observamos las llamadas al método (ya está configurado como jest.fn())
        // Razón: Validaremos que se llamó con el ID parseado correctamente
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedUser);
        
        // SPY: Validamos que findUserById fue llamado con el ID correcto (parseado a número)
        expect(mockRepository.findUserById).toHaveBeenCalledTimes(1);
        expect(mockRepository.findUserById).toHaveBeenCalledWith(userId);
    });

    // Prueba para un usuario que no existe
    test('GET /about/:id debe retornar 404 si el usuario no existe', async () => {
        // Arrange
        const nonExistentUserId = 999;
        const route = `/about/${nonExistentUserId}`;
        const expectedStatusCode = 404;
        const expectedError = { error: "User not found" };
        
        // STUB: Configuramos findUserById para retornar array vacío (usuario no encontrado)
        // Razón: Simulamos el comportamiento de BD cuando no existe el usuario
        mockRepository.findUserById.mockResolvedValue([]);
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // SPY: Validamos que se intentó buscar el usuario
        expect(mockRepository.findUserById).toHaveBeenCalledTimes(1);
        expect(mockRepository.findUserById).toHaveBeenCalledWith(nonExistentUserId);
    });

    // Prueba opcional: verificar tipos de datos
    test('GET /about/:id debe retornar JSON', async () => {
        // Arrange
        const userId = 2;
        const route = `/about/${userId}`;
        const expectedContentType = 'application/json';
        const expectedUserName = 'Bob';
        const expectedUser = { id: 2, name: 'Bob' };
        
        // STUB: Configuramos findUserById para retornar usuario Bob
        mockRepository.findUserById.mockResolvedValue([expectedUser]);
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.type).toBe(expectedContentType);
        expect(response.body.name).toBe(expectedUserName);
        
        // SPY: Validamos la interacción
        expect(mockRepository.findUserById).toHaveBeenCalledWith(userId);
    });

    // Edge case: id no numérico -> 400
    test('GET /about/:id debe retornar 400 para id no numérico', async () => {
        // Arrange
        const invalidId = 'abc';
        const route = `/about/${invalidId}`;
        const expectedStatusCode = 400;
        const expectedError = { error: "Invalid id format" };
        
        // NOTA: No configuramos stub porque isValidId() rechaza antes de llamar a BD
        // El método findUserById NO debería ser llamado en este caso
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // SPY: Validamos que findUserById NO fue llamado (validación previa rechazó el ID)
        expect(mockRepository.findUserById).not.toHaveBeenCalled();
    });

    // Edge case: id decimal (no entero) -> 400
    test('GET /about/:id debe retornar 400 para id decimal', async () => {
        // Arrange
        const decimalId = '1.5';
        const route = `/about/${decimalId}`;
        const expectedStatusCode = 400;
        const expectedError = { error: "Invalid id format" };
        
        // NOTA: No configuramos stub porque isValidId() rechaza antes de llamar a BD
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // SPY: Validamos que findUserById NO fue llamado
        expect(mockRepository.findUserById).not.toHaveBeenCalled();
    });

    // Edge case: cadena numérica con punto pero equivalente a entero '2.0' -> válido
    test('GET /about/:id acepta "2.0" y retorna usuario Bob', async () => {
        // Arrange
        const validDecimalId = '2.0';
        const route = `/about/${validDecimalId}`;
        const expectedStatusCode = 200;
        const expectedUser = { id: 2, name: 'Bob' };
        const parsedUserId = 2; // El ID se parsea a 2
        
        // STUB: Configuramos findUserById para retornar usuario Bob
        // Nota: El ID se parsea a número antes de llamar a findUserById
        mockRepository.findUserById.mockResolvedValue([expectedUser]);
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedUser);
        
        // SPY: Validamos que se llamó con el ID parseado (2, no "2.0")
        expect(mockRepository.findUserById).toHaveBeenCalledTimes(1);
        expect(mockRepository.findUserById).toHaveBeenCalledWith(parsedUserId);
    });

    // Edge case: id negativo válido numéricamente pero no existe -> 404
    test('GET /about/:id debe retornar 404 para id negativo', async () => {
        // Arrange
        const negativeId = '-1';
        const route = `/about/${negativeId}`;
        const expectedStatusCode = 404;
        const expectedError = { error: "User not found" };
        const parsedUserId = -1; // El ID se parsea a -1
        
        // STUB: Configuramos findUserById para retornar array vacío (usuario no encontrado)
        mockRepository.findUserById.mockResolvedValue([]);
        
        // Act
        const response = await request(app).get(route);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // SPY: Validamos que se intentó buscar con el ID negativo parseado
        expect(mockRepository.findUserById).toHaveBeenCalledTimes(1);
        expect(mockRepository.findUserById).toHaveBeenCalledWith(parsedUserId);
    });
});
