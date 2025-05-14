const { Router } = require('express');
const routerCliente = Router();

const { getEst } = require('../controller/asistenciaCtrl.js');

routerCliente.get('/getAll', getEst  );

module.exports = routerCliente;