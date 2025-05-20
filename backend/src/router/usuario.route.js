const { Router } = require('express');
const routerUsuario = Router();

const { getValLogin, setAsistencia } = require('../controller/usuarioCtrl.js');

routerUsuario.post('/getuserLogin', getValLogin  );

routerUsuario.post('/setAsistencia', setAsistencia  );

module.exports = routerUsuario;