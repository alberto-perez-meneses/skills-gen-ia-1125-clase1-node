const request = require('supertest');

// Mock del repositorio antes de importar la aplicación
const mockUserRepository = {
    findUserById: jest.fn(),
    disconnect: jest.fn()
};

// Mock del RepositoryFactory como clase con método estático
jest.mock('../src/repositories', () => {
    class MockRepositoryFactory {
        static create() {
            return mockUserRepository;
        }
    }
    return MockRepositoryFactory;
});

const app = require('../index'); // Importamos tu aplicación después de configurar los mocks

describe('API Endpoints', () => {
    
    // Limpiar mocks entre tests
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Prueba para la ruta raíz
    test('GET / debe retornar Hello World!', async () => {
        // Arrange
        const expectedStatusCode = 200;
        const expectedText = 'Hello World!';
        
        // Act
        const response = await request(app).get('/');
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.text).toBe(expectedText);
    });

    // Prueba para obtener un usuario existente
    test('GET /about/:id debe retornar un usuario existente (Alice)', async () => {
        // Arrange
        const userId = 1;
        const expectedStatusCode = 200;
        const expectedUser = { id: 1, name: 'Alice' };
        
        // STUB: Simular respuesta de la base de datos con datos fijos
        mockUserRepository.findUserById.mockResolvedValue([expectedUser]);
        
        // Act
        const response = await request(app).get(`/about/${userId}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedUser);
        
        // MOCK: Validar que se llamó al repositorio con el parámetro correcto
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    // Prueba para un usuario que no existe
    test('GET /about/:id debe retornar 404 si el usuario no existe', async () => {
        // Arrange
        const nonExistentUserId = 999;
        const expectedStatusCode = 404;
        const expectedError = { error: "User not found" };
        
        // STUB: Simular que la base de datos no encuentra el usuario (array vacío)
        mockUserRepository.findUserById.mockResolvedValue([]);
        
        // Act
        const response = await request(app).get(`/about/${nonExistentUserId}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // MOCK: Validar que se llamó al repositorio con el parámetro correcto
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(nonExistentUserId);
        expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    // Prueba opcional: verificar tipos de datos
    test('GET /about/:id debe retornar JSON', async () => {
        // Arrange
        const userId = 2;
        const expectedContentType = 'application/json';
        const expectedUserName = 'Bob';
        const expectedUser = { id: 2, name: 'Bob' };
        
        // STUB: Simular respuesta de la base de datos con datos fijos
        mockUserRepository.findUserById.mockResolvedValue([expectedUser]);
        
        // Act
        const response = await request(app).get(`/about/${userId}`);
        
        // Assert
        expect(response.type).toBe(expectedContentType);
        expect(response.body.name).toBe(expectedUserName);
        
        // MOCK: Validar que se llamó al repositorio con el parámetro correcto
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId);
        expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    // Edge case: id no numérico -> 400
    test('GET /about/:id debe retornar 400 para id no numérico', async () => {
        // Arrange
        const invalidId = 'abc';
        const expectedStatusCode = 400;
        const expectedError = { error: "Invalid id format" };
        
        // Act
        const response = await request(app).get(`/about/${invalidId}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // MOCK: Validar que el repositorio NO fue llamado (validación falló antes)
        expect(mockUserRepository.findUserById).not.toHaveBeenCalled();
    });

    // Edge case: id decimal (no entero) -> 400
    test('GET /about/:id debe retornar 400 para id decimal', async () => {
        // Arrange
        const decimalId = '1.5';
        const expectedStatusCode = 400;
        const expectedError = { error: "Invalid id format" };
        
        // Act
        const response = await request(app).get(`/about/${decimalId}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // MOCK: Validar que el repositorio NO fue llamado (validación falló antes)
        expect(mockUserRepository.findUserById).not.toHaveBeenCalled();
    });

    // Edge case: cadena numérica con punto pero equivalente a entero '2.0' -> válido
    test('GET /about/:id acepta "2.0" y retorna usuario Bob', async () => {
        // Arrange
        const validDecimalId = '2.0';
        const expectedStatusCode = 200;
        const expectedUser = { id: 2, name: 'Bob' };
        
        // STUB: Simular respuesta de la base de datos con datos fijos
        mockUserRepository.findUserById.mockResolvedValue([expectedUser]);
        
        // Act
        const response = await request(app).get(`/about/${validDecimalId}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedUser);
        
        // MOCK: Validar que se llamó al repositorio con el id parseado correctamente (2)
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(2);
        expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    // Edge case: id negativo válido numéricamente pero no existe -> 404
    test('GET /about/:id debe retornar 404 para id negativo', async () => {
        // Arrange
        const negativeId = '-1';
        const expectedStatusCode = 404;
        const expectedError = { error: "User not found" };
        
        // STUB: Simular que la base de datos no encuentra el usuario (array vacío)
        mockUserRepository.findUserById.mockResolvedValue([]);
        
        // Act
        const response = await request(app).get(`/about/${negativeId}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedError);
        
        // MOCK: Validar que se llamó al repositorio con el id parseado correctamente (-1)
        expect(mockUserRepository.findUserById).toHaveBeenCalledWith(-1);
        expect(mockUserRepository.findUserById).toHaveBeenCalledTimes(1);
    });

    // Pruebas para el endpoint /reverse/:str
    test('GET /reverse/:str debe invertir una cadena normal', async () => {
        // Arrange
        const input = 'hello';
        const expectedStatusCode = 200;
        const expectedResponse = { original: 'hello', reversed: 'olleh' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe retornar cadena vacía cuando se pasa cadena vacía', async () => {
        // Arrange
        const input = '';
        const expectedStatusCode = 404;
        const expectedResponse = { original: '', reversed: '' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
    });

    test('GET /reverse/:str debe retornar el mismo carácter cuando se pasa un solo carácter', async () => {
        // Arrange
        const input = 'a';
        const expectedStatusCode = 200;
        const expectedResponse = { original: 'a', reversed: 'a' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe invertir una cadena con espacios', async () => {
        // Arrange
        const input = 'hello world';
        const expectedStatusCode = 200;
        const expectedResponse = { original: 'hello world', reversed: 'dlrow olleh' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe invertir una cadena con caracteres especiales', async () => {
        // Arrange
        const input = 'a!b@c#';
        const expectedStatusCode = 200;
        const expectedResponse = { original: 'a!b@c', reversed: 'c@b!a' };
        

        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe invertir una cadena numérica', async () => {
        // Arrange
        const input = '123';
        const expectedStatusCode = 200;
        const expectedResponse = { original: '123', reversed: '321' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe invertir una cadena con mayúsculas y minúsculas', async () => {
        // Arrange
        const input = 'Hello';
        const expectedStatusCode = 200;
        const expectedResponse = { original: 'Hello', reversed: 'olleH' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe manejar caracteres codificados en URL', async () => {
        // Arrange
        const input = 'hello%20world';
        const expectedStatusCode = 200;
        const expectedResponse = { original: 'hello world', reversed: 'dlrow olleh' };
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.body).toEqual(expectedResponse);
    });

    test('GET /reverse/:str debe retornar JSON', async () => {
        // Arrange
        const input = 'test';
        const expectedStatusCode = 200;
        const expectedContentType = 'application/json';
        
        // Act
        const response = await request(app).get(`/reverse/${input}`);
        
        // Assert
        expect(response.statusCode).toBe(expectedStatusCode);
        expect(response.type).toBe(expectedContentType);
        expect(response.body).toHaveProperty('original');
        expect(response.body).toHaveProperty('reversed');
    });
});