const express = require('express');
const router = express.Router();
const { createUser, getUser, getAllUsers, updateUser, deleteUser, validateUser } = require('../database');



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

router.get('/users', (req, res) => {
    res.json(getAllUsers());
});

router.get('/users/:user', (req, res) => {
    const user = req.params.user;
    const userObj = getUser(user);
    if (userObj) {
        res.json(userObj);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

router.put('/users/:user', (req, res) => {
    const oldUserName = req.params.user;  // El nombre de usuario actual
    const newPassword = req.body.password;  // La nueva contraseña
    const newUserName = req.body.user;  // El nuevo nombre de usuario

    try {
        // Verificar que el nuevo nombre de usuario no exista ya
        if (newUserName !== oldUserName && getUser(newUserName)) {
            return res.status(400).send("El nuevo nombre de usuario ya está en uso.");
        }

        // Llamar a la función que actualiza el nombre de usuario y la contraseña
        updateUser(oldUserName, newUserName, newPassword);
        res.status(200).send('Usuario actualizado');
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send('Error al actualizar el usuario');
    }
});


router.delete('/users/:user', (req, res) => {
    const user = req.params.user;
    try {
        deleteUser(user);
        res.status(200).send('Usuario eliminado');
    } catch (err) {
        res.status(500).send('Error al eliminar el usuario');
    }
});

router.post('/login', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    const userObj = getUser(user);
    if (userObj && validateUser(user, password)) {
        res.cookie('user', user);
        res.status(200).send('Login correcto');
    } else {
        res.status(401).send('Login incorrecto');
    }
});

module.exports = router;

