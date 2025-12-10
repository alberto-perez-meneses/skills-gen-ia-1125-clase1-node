const { reverseString, findUserById } = require('../lib/string');

describe('Librería de Strings', () => {
    
    describe('reverseString', () => {
        
        test('debe invertir una cadena normal', () => {
            // Arrange
            const input = 'hello';
            const expected = 'olleh';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });

        test('debe retornar cadena vacía cuando se pasa cadena vacía', () => {
            // Arrange
            const input = '';
            const expected = '';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });

        test('debe retornar el mismo carácter cuando se pasa un solo carácter', () => {
            // Arrange
            const input = 'a';
            const expected = 'a';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });

        test('debe invertir una cadena con espacios', () => {
            // Arrange
            const input = 'hello world';
            const expected = 'dlrow olleh';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });

        test('debe invertir una cadena con caracteres especiales', () => {
            // Arrange
            const input = 'a!b@c#';
            const expected = '#c@b!a';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });

        test('debe invertir una cadena numérica', () => {
            // Arrange
            const input = '123';
            const expected = '321';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });

        test('debe invertir una cadena con mayúsculas y minúsculas', () => {
            // Arrange
            const input = 'Hello';
            const expected = 'olleH';
            
            // Act
            const result = reverseString(input);
            
            // Assert
            expect(result).toBe(expected);
        });
    });

    describe('findUserById', () => {
        
        test('debe encontrar un usuario cuando existe en el array', () => {
            // Arrange
            const users = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
                { id: 3, name: 'Charlie' }
            ];
            const userId = 2;
            const expected = { id: 2, name: 'Bob' };
            
            // Act
            const result = findUserById(users, userId);
            
            // Assert
            expect(result).toEqual(expected);
        });

        test('debe retornar undefined cuando el usuario no existe', () => {
            // Arrange
            const users = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ];
            const userId = 999;
            
            // Act
            const result = findUserById(users, userId);
            
            // Assert
            expect(result).toBeUndefined();
        });

        test('debe retornar undefined cuando el array está vacío', () => {
            // Arrange
            const users = [];
            const userId = 1;
            
            // Act
            const result = findUserById(users, userId);
            
            // Assert
            expect(result).toBeUndefined();
        });

        test('debe encontrar el usuario correcto cuando hay múltiples usuarios', () => {
            // Arrange
            const users = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
                { id: 3, name: 'Charlie' },
                { id: 4, name: 'David' }
            ];
            const userId = 3;
            const expected = { id: 3, name: 'Charlie' };
            
            // Act
            const result = findUserById(users, userId);
            
            // Assert
            expect(result).toEqual(expected);
        });

        test('debe encontrar usuario cuando el ID es un número y el userId es string', () => {
            // Arrange
            const users = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ];
            const userId = '2';
            
            // Act
            const result = findUserById(users, userId);
            
            // Assert
            expect(result).toBeUndefined();
        });
    });
});

