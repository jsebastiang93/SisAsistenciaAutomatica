const express = require('express');

const rotuerLogin = require('./router/usuario.route');
const rotuerInfoMateria = require('./router/asignatura.route');


const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes

app.use('/loginUser', rotuerLogin);

app.use('/infoMateria', rotuerInfoMateria);


app.listen(3000);

console.log('Server on port', 3000);