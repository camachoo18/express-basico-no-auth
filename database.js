const bcrypt = require('bcrypt');
const saltRounds = 10;
const Database = require('better-sqlite3');
const fs = require('fs');
const crypto = require('crypto');
/*
const db = new Database(':memory:');
db.exec("CREATE TABLE users (user TEXT PRIMARY KEY, password TEXT)");
db.exec("INSERT INTO users (user, password) VALUES ('admin', '81dc9bdb52d04dc20036dbd8313ed055')");
*/
let db_aux = null;
if (!fs.existsSync('database.db')) {
    db_aux = new Database('database.db');
    db_aux.exec("CREATE TABLE users (user TEXT PRIMARY KEY, password TEXT, apikey TEXT UNIQUE)");
    console.log("Base de datos creada.");
} else {
    db_aux = new Database('database.db');
    
    // Verificar si la columna 'apikey' existe antes de añadirla
    if (!columnExists('users', 'apikey')) {
        db_aux.exec("ALTER TABLE users ADD COLUMN apikey TEXT UNIQUE");
        console.log("Columna 'apikey' añadida.");
    } else {
        console.log("La columna 'apikey' ya existe.");
    }
}


function columnExists(tableName, columnName) {
    const result = db_aux.prepare(`PRAGMA table_info(${tableName})`).all();
    return result.some(column => column.name === columnName);
}

const db = db_aux;

// Implementacion de apikey a nuestros usuarios

// Generar una API Key
function generateApiKey() {
    return crypto.randomBytes(16).toString('hex'); // Genera un string aleatorio de 32 caracteres
}
// Validar API Key
function validateApiKey(apiKey) {
    const user = getUserByApiKey(apiKey);
    return !!user; // Retorna true si el API Key es válido, de lo contrario false
}

// Obtener un usuario por API Key
function getUserByApiKey(apiKey) {
    const getUserByApiKeyStatement = db.prepare("SELECT * FROM users WHERE apikey = ?");
    return getUserByApiKeyStatement.get(apiKey);
}

// Obtener un usuario
function getUser(user) {
    const getUserStatement = db.prepare("SELECT * FROM users WHERE user = ?");
    return getUserStatement.get(user);
}
// obtener todos los usuarios
function getAllUsers(){
    const getAllUsersStatement = db.prepare("SELECT * FROM users");
    return getAllUsersStatement.all();
}
//borrar user
function deleteUser(user){
    const deleteUserStatement = db.prepare("DELETE FROM users WHERE user = ?");
    deleteUserStatement.run(user);
}

// Crear un usuario
function createUser(user, password) {
    const insertUserStatement = db.prepare("INSERT INTO users (user, password, apikey) VALUES (?, ?, ?)");
    const hash = bcrypt.hashSync(password, saltRounds);
    const apiKey = generateApiKey(); // Generar API Key
    insertUserStatement.run(user, hash, apiKey);
}
// Actualizar o modificar user o pw
function updateUser(oldUserName, newUserName, newPassword) {
    // Verificar si el usuario antiguo existe
    const user = getUser(oldUserName);
    if (!user) {
        throw new Error("El usuario antiguo no existe.");
    }

    // Verificar si el nuevo nombre de usuario ya está en uso (excepto cuando el nombre no cambia)
    if (newUserName !== oldUserName && getUser(newUserName)) {
        throw new Error("El nuevo nombre de usuario ya está en uso.");
    }

    // Si el nombre de usuario cambia, actualizar el nombre
    if (newUserName && newUserName !== oldUserName) {
        const updateUserNameStatement = db.prepare("UPDATE users SET user = ? WHERE user = ?");
        updateUserNameStatement.run(newUserName, oldUserName);
    }

    // Si se pasa una nueva contraseña, actualizarla
    if (newPassword) {
        const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
        const updatePasswordStatement = db.prepare("UPDATE users SET password = ? WHERE user = ?");
        updatePasswordStatement.run(hashedPassword, oldUserName);
    }
}

// Validar usuario
function validateUser(user, password) {
    const userObj = getUser(user);
    //password is plaintext
    return bcrypt.compareSync(password, userObj.password);
}



module.exports = {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    validateUser,
    validateApiKey
};
