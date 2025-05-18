const { Router } = require('express');
const routerCliente = Router();

const { getValLogin } = require('../controller/usuarioCtrl.js');

routerCliente.post('/getuserLogin', getValLogin  );

module.exports = routerCliente;