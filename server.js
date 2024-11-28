require('dotenv').config();  // Cargar las variables de entorno
// Ademas dotenv es util para añadir cierta seguridad a la clave y que no este visible,
//de esta manera evitamos que cualquier persona acceda y asi solo lo veamos nosotros.

const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar express-session usando la variable de entorno
app.use(session({
    secret: process.env.SESSION_SECRET,  // Usamos el valor desde .env
    resave: false,                      // No guardar la sesion si no hay cambios
    saveUninitialized: true,            // Guardar la sesion incluso si no esta inicializada
    cookie: { secure: false }           // En producción, deberías configurar esto como `true` con HTTPS
}));

// Middleware para loguear cada request
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// Aquí van tus rutas y demás configuración
const users = require('./routes/users');
app.use("/api/", users);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
