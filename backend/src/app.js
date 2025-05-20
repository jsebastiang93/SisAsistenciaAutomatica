const express = require('express');
const cors = require('cors');
const rotuerLogin = require('./router/usuario.route');
const rotuerInfoMateria = require('./router/asignatura.route');


const app = express();
app.use(cors());

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes

app.use('/loginUser', rotuerLogin);

app.use('/infoMateria', rotuerInfoMateria);


app.use('/registroCod', rotuerLogin);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});