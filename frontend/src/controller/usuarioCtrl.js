const pool = require('../conexion/cone.js');

const getValLogin = async (req, res) => {
    const { user, pass } = req.body;

    try {
        const response = await pool.query(
            `SELECT * FROM usuarios u WHERE vigencia = true AND contrasena = $1 AND usuario = $2`,
            [pass, user]
        );

        // Validar si se encontró algún usuario
        if (response.rows.length > 0) {
            res.status(200).json({
                success: true,
                mensaje: 'Usuario válido',
                usuario: response.rows
            });
        } else {
            res.status(401).json({
                success: false, 
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    getValLogin
};
