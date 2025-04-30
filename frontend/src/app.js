const express = require('express');

const routerAsistencia = require('./router/asistencia');


const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/asistencia', routerAsistencia);
app.listen(3000);

console.log('Server on port', 3000);