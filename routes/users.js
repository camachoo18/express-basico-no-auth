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
        res.status(500).send("Usuario ya existe");
    }
});

router.get('/users', (req, res) => {
    res.json(getAllUsers());
});

router.get('/users/:user', (req, res) => {
    //TODO: cambiar if-else por try-catch
    const user = req.params.user;
    const userObj = getUser(user);
    if (userObj) {
        res.json(userObj);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

router.put('/users/:user', (req, res) => {
    const user = req.params.user; //Parametros en la url para acceder al usuario que queremos
    //const new_user = req.body.user;
    const password = req.body.password; //Accedemos a la propiedad password de un usuario, para poder cambiarla
    try {
        updateUser(user, password);
        res.status(200).send('Usuario actualizado');
    } catch (err) {
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
        // Guardamos el nombre del usuario en la sesión
        req.session.user = user;
        res.status(200).send('Login correcto');
    } else {
        res.status(401).send('Login incorrecto');
    }
});


//Middleware
function isAuthenticated(req, res, next){
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Usuario no autenticado')
    }
};


// Ruta para verificar si el usuario está autenticado
router.get('/profile', isAuthenticated, (req, res) => {
    if (req.session.user) {
        // El usuario está autenticado
        res.status(200).send(`Bienvenido ${req.session.user}`);
    } else {
        // El usuario no está autenticado
        res.status(401).send('No estás autenticado');
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logout correcto')
});

module.exports = router;
