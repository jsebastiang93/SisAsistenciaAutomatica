const { Router } = require('express');
const routerExcusa = Router();

const { getExcusas } = require('../controller/excusaController.js');

routerExcusa.get('/getExcusas', getExcusas  );

module.exports = routerExcusa;