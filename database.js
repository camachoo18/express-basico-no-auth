const bcrypt = require('bcrypt');
const saltRounds = 10;
const Database = require('better-sqlite3');
const fs = require('fs');
/*
const db = new Database(':memory:');
db.exec("CREATE TABLE users (user TEXT PRIMARY KEY, password TEXT)");
db.exec("INSERT INTO users (user, password) VALUES ('admin', '81dc9bdb52d04dc20036dbd8313ed055')");
*/
let db_aux = null;
if(!fs.existsSync('database.db')){
    db_aux = new Database('database.db');//cambia por database.db para guardar en un archivo
    db_aux.exec("CREATE TABLE users (user TEXT PRIMARY KEY, password TEXT)");
} else {
    db_aux = new Database('database.db');
}
const db = db_aux;

function getUser(user) {
    const getUserStatement = db.prepare("SELECT * FROM users WHERE user = ?");
    return getUserStatement.get(user);
}

function getAllUsers(){
    const getAllUsersStatement = db.prepare("SELECT * FROM users");
    return getAllUsersStatement.all();
}

function deleteUser(user){
    const deleteUserStatement = db.prepare("DELETE FROM users WHERE user = ?");
    deleteUserStatement.run(user);
}


function createUser(user, password) {
    const insertUserStatement = db.prepare("INSERT INTO users (user, password) VALUES (?, ?)");
    const hash = bcrypt.hashSync(password, saltRounds);
    insertUserStatement.run(user, hash);
}

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
    validateUser
};