const pool = require('../conexion/cone.js');

const getEst = async (req, res) => {

    const response = await pool.query('SELECT * FROM asistencia.asistencia ');
    console.log(response);
    res.status(200).json(response.rows);
};


module.exports = {
    getEst
};