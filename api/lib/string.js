function reverseString(str) {
  return str.split("").reverse().join("");
}

// Validador de ID (Principio SRP)
function isValidId(id) {
  return !isNaN(id) && Number.isInteger(Number(id));
}

// Búsqueda de usuario (Principio SRP)
function findUserById(users, userId) {
  return users.find(u => u.id === userId);
}

module.exports = { reverseString, isValidId, findUserById };
