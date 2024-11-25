const { createUser, getUser, validateApiKey } = require('./database');

// Crear un usuario
createUser("testUser", "testPassword");

// Obtener el usuario
const user = getUser("testUser");
console.log("Usuario creado:", user);

// Validar la API Key
console.log("¿API Key válida?", validateApiKey(user.apikey));
