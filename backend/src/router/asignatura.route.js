const { Router } = require('express');
const routerAsignatura = Router();

const { getPeriodo,getAsignatura, getAsistencia,getInfoDocente } = require('../controller/asistenciaCtrl.js');

routerAsignatura.get('/getPeriodo', getPeriodo  );

routerAsignatura.post('/getAsignatura', getAsignatura  );

routerAsignatura.post('/getAsistencia', getAsistencia  );

routerAsignatura.post('/getInfoDocente', getInfoDocente  );

module.exports = routerAsignatura;