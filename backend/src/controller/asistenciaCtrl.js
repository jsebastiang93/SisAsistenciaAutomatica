const pool = require('../conexion/cone.js');

//trae, los periodos activos
const getPeriodo = async (req, res) => {
    try {
        const response = await pool.query(
            `SELECT pa.id_periodo_acad,pa.cod_periodo_acad||' - '||pa.descripcion AS descripcion 
                FROM periodo_academico pa WHERE vigencia = TRUE`
        );

        if (response.rows.length > 0) {
            res.status(200).json({
                mensaje: 'Periodos académicos vigentes encontrados',
                status: 200,
                datos: response.rows
            });
        } else {
            res.status(404).json({
                mensaje: 'No hay periodos académicos vigentes disponibles',
                status: 400
            });
        }

    } catch (error) {
        console.error('Error al consultar los periodos académicos:', error);
        res.status(500).json({
            error: 'Error interno del servidor'
        });
    }
};


// trae, las asignaturas, asociadas al periodo academico
const getAsignatura = async (req, res) => {
    const { cod_docente } = req.body;

    try {
        const response = await pool.query(
            `SELECT  ap.id_asig_periodo,a.descripcion, 
                        TO_CHAR(ap.hora_inicio, 'HH12:MI AM') || ' - ' || TO_CHAR(ap.hora_fin, 'HH12:MI AM') AS horario,
                        ap.dia 
                    FROM asignaturas_periodo ap 
                    INNER JOIN asignaturas a ON a.id_asignatura = ap.id_asignatura  
                    INNER JOIN periodo_academico pa ON pa.id_periodo_acad = ap.id_periodo_acad 
                    WHERE ap.cod_docente = $1`,
            [cod_docente]
        );

        if (response.rows.length > 0) {
            res.status(200).json({
                status: 200,
                usuario: response.rows
            });
        } else {
            res.status(400).json({
                status: 400
            });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// trae, la asistencia por fecha, y asignatura
const getAsistencia = async (req, res) => {
    const { asignatura, fecha } = req.body;

    try {
        const response = await pool.query(
            `SELECT a.id_asistencia,e.nombre_completo, a.hora_asistencia,ea.descripcion 
                    FROM  asistencias a 
                    INNER JOIN estudiantes e ON e.cod_estudiante = a.cod_estudiante 
                    INNER JOIN estados_asistencia ea ON ea.id_estados_asis = a.id_estado_asis 
                    WHERE id_asig_periodo = $1
                    AND fecha_asistencia = $2`,
            [asignatura,fecha]
        );

        if (response.rows.length > 0) {
            res.status(200).json({
                status: 200,
                usuario: response.rows
            });
        } else {
            res.status(400).json({
                mensaje: 'No se econtraron asistencia para los filtros seleccionados',
                status: 400
            });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



// trae, la asistencia por fecha, y asignatura
const getInfoDocente = async (req, res) => {
    const { cod_docente } = req.body;

    try {
        const response = await pool.query(
            `SELECT ap.id_asig_periodo,ap.cod_docente, d.nombre_completo,  
                    TO_CHAR(ap.hora_inicio, 'HH12:MI AM') || ' - ' || TO_CHAR(ap.hora_fin, 'HH12:MI AM') AS horario
                    FROM asignaturas_periodo ap 
                    INNER JOIN asignaturas a ON a.id_asignatura = ap.id_asignatura  
                    INNER JOIN docentes d ON d.cod_docente = ap.cod_docente 
                    WHERE ap.cod_docente = $1`,
            [cod_docente]
        );

        if (response.rows.length > 0) {
            res.status(200).json({
                status: 200,
                usuario: response.rows
            });
        } else {
            res.status(400).json({
                status: 400
            });
        }
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    getPeriodo,
    getAsignatura,
    getAsistencia,
    getInfoDocente
};
