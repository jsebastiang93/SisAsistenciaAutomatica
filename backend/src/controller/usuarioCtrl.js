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


const validarEstudiante = async (cedula) => {
    try {
        const query = `
                    SELECT * FROM estudiantes e 
                                WHERE e.num_identificacion = $1
                                `;
        const result = await pool.query(query, [cedula]);

        if (result.rows.length > 0) {
            const cod_estudiante = result.rows[0].cod_estudiante; // Ajusta si el campo tiene otro nombre
            return cod_estudiante;
        } else {
            console.log("No se encontraron registros con la cédula proporcionada.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error al consultar en la base de datos:", error);
        return null;
    }
};


const validarEstadoAsistencia = (horaAsistencia) => {
    const horaClase = new Date(horaAsistencia);
    horaClase.setHours(18, 30, 0, 0); // 18:30:00

    const diferenciaMinutos = (new Date(horaAsistencia) - horaClase) / 60000;

    let estadoId;

    if (diferenciaMinutos >= 0 && diferenciaMinutos <= 15) {
        estadoId = 5; // Asistió
    } else if (diferenciaMinutos >= 16 && diferenciaMinutos <= 30) {
        estadoId = 6; // Retraso
    } else {
        estadoId = 7; // Inasistencia
    }

    return estadoId;
};


const setAsistencia = async (req, res) => {
    const { documento, fecha_asis, hora_asis, periodo_id } = req.body;

    try {
        const codEstudiante = await validarEstudiante(documento);
        const estadoAsistencia = validarEstadoAsistencia(hora_asis);

        if (!codEstudiante) {
            console.log("❌ No se pudo obtener cod_estudiante.");
            return res.status(400).json({
                success: false,
                mensaje: "No se encontró el estudiante con ese documento."
            });
        }

        const insertQuery = `
                        INSERT INTO asistencias (
                            cod_estudiante, id_asig_periodo, fecha_asistencia, hora_asistencia, id_estado_asis
                        ) VALUES ($1, $2, $3, $4, $5)
                        `;

        await pool.query(insertQuery, [
            codEstudiante, periodo_id, fecha_asis, hora_asis, estadoAsistencia
        ]);

        console.log("✅ Asistencia registrada correctamente.");
        return res.status(200).json({
            success: true,
            mensaje: "Asistencia registrada correctamente."
        });
    } catch (error) {
        console.error("❌ Error al insertar asistencia:", error);
        return res.status(500).json({
            success: false,
            mensaje: "Error interno al registrar la asistencia."
        });
    }
};




module.exports = {
    getValLogin,
    setAsistencia
};
