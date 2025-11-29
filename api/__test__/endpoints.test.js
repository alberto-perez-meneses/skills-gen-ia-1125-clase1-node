const request = require('supertest');
const app = require('../index'); // Importamos tu aplicación

describe('API Endpoints', () => {
    
    // Prueba para la ruta raíz
    test('GET / debe retornar Hello World!', async () => {
        const response = await request(app).get('/');
        
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World!');
    });

    // Prueba para obtener un usuario existente
    test('GET /about/:id debe retornar un usuario existente (Alice)', async () => {
        const response = await request(app).get('/about/1');
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ id: 1, name: 'Alice' });
    });

    // Prueba para un usuario que no existe
    test('GET /about/:id debe retornar 404 si el usuario no existe', async () => {
        const response = await request(app).get('/about/999');
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });

    // Prueba opcional: verificar tipos de datos
    test('GET /about/:id debe retornar JSON', async () => {
        const response = await request(app).get('/about/2');
        
        expect(response.type).toBe('application/json');
        expect(response.body.name).toBe('Bob');
    });

    // Edge case: id no numérico -> 400
    test('GET /about/:id debe retornar 400 para id no numérico', async () => {
        const response = await request(app).get('/about/abc');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid id format" });
    });

    // Edge case: id decimal (no entero) -> 400
    test('GET /about/:id debe retornar 400 para id decimal', async () => {
        const response = await request(app).get('/about/1.5');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid id format" });
    });

    // Edge case: cadena numérica con punto pero equivalente a entero '2.0' -> válido
    test('GET /about/:id acepta "2.0" y retorna usuario Bob', async () => {
        const response = await request(app).get('/about/2.0');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ id: 2, name: 'Bob' });
    });

    // Edge case: id negativo válido numéricamente pero no existe -> 404
    test('GET /about/:id debe retornar 404 para id negativo', async () => {
        const response = await request(app).get('/about/-1');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ error: "User not found" });
    });
});