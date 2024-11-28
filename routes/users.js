const express = require('express');
const router = express.Router();
const { createUser, getUser, getAllUsers, updateUser, deleteUser, validateUser } = require('../database');

// Ruta para crear un nuevo usuario
router.post('/users', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    try {
        createUser(user, password);
        res.status(201).send('Usuario creado');
    } catch (err) {
        res.status(500).send("Error al crear el usuario");
    }
});

// Ruta para obtener todos los usuarios
router.get('/users', (req, res) => {
    res.json(getAllUsers());
});

// Ruta para obtener un usuario específico
router.get('/users/:user', (req, res) => {
    const user = req.params.user;
    const userObj = getUser(user);
    if (userObj) {
        res.json(userObj);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// Ruta para actualizar el usuario
router.put('/users/:user', (req, res) => {
    const oldUserName = req.params.user;
    const newPassword = req.body.password;
    const newUserName = req.body.user;

    try {
        if (newUserName !== oldUserName && getUser(newUserName)) {
            return res.status(400).send("El nuevo nombre de usuario ya está en uso.");
        }

        updateUser(oldUserName, newUserName, newPassword);
        res.status(200).send('Usuario actualizado');
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Ruta para eliminar un usuario
router.delete('/users/:user', (req, res) => {
    const user = req.params.user;
    try {
        deleteUser(user);
        res.status(200).send('Usuario eliminado');
    } catch (err) {
        res.status(500).send('Error al eliminar el usuario');
    }
});

// Ruta para login (autenticación con sesiones)
router.post('/login', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    const userObj = getUser(user);

    if (userObj && validateUser(user, password)) {
        req.session.user = user;  // Guardamos el usuario en la sesión
        res.status(200).send('Login correcto');
    } else {
        res.status(401).send('Login incorrecto');
    }
});

// Ruta para logout (cerrar sesión)
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {  // Destruimos la sesión
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.status(200).send('Sesión cerrada');
    });
});

// Ruta para obtener la información del usuario desde la sesión
router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).send('No estás autenticado');
    }
});

module.exports = router;
