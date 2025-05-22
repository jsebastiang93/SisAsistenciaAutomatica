const pool = require('../conexion/cone.js');

// Función obtener el listado de tipos de excusas disponibles
const getExcusas = async (req, res) => {
    try {
        const response = await pool.query(
            `SELECT * FROM excusas_inasistencia WHERE vigencia = true`
        );

        if (response.rows.length > 0) {
            res.status(200).json({
                mensaje: 'Excusas de inasistencia encontradas',
                status: 200,
                datos: response.rows
            });
        } else {
            res.status(404).json({
                mensaje: 'No hay excusas de inasistencia disponibles',
                status: 400
            });
        }
    } catch (error) {
        console.error('Error al consultar las excusas de inasistencia:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};

module.exports = {
    getExcusas
};
