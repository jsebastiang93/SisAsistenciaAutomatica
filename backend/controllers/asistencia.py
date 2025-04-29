from db.conexion import get_connection


def validar_estudiante(cedula):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = "SELECT * FROM asistencia.estudiantes e WHERE e.num_identificacion = %s"
        cursor.execute(query, (cedula,))
        row = cursor.fetchone()

        if row:
            cod_estudiante = row[0]
            return cod_estudiante
        else:
            print("No se encontraron registros con la cédula proporcionada.")
            return None
    except Exception as e:
        print(f"❌ Error al consultar en la base de datos: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
def validar_estado_asistencia(hora_asistencia):


    # Hora fija (hora de inicio de clase)
    hora_clase = hora_asistencia.replace(hour=18, minute=30, second=0, microsecond=0)

    # Calcular la diferencia en minutos
    diferencia_minutos = (hora_asistencia - hora_clase).total_seconds() / 60

    # Inicializar valores
    estado = None
    estado_id = None

    # Validar antes de iniciar la clase
    if 0 <= diferencia_minutos <= 15:
        #ASISITIO
        estado_id = 1
    elif 16 <= diferencia_minutos <= 30:
        #RETRASO
        estado_id = 2
    else:
        #INASISTENCIA
        estado_id = 3

    # También podrías retornarlo si quieres usarlo después
    return estado_id


def insert_asistencia(cedula, fecha_actual, hora_actual):
    try:
        cod_estudiante = validar_estudiante(cedula)
        estado_asistencia = validar_estado_asistencia(hora_actual)
        
        if cod_estudiante is None :
            print("❌ No se pudo obtener id_estudiante o id_clase.")
            return

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO asistencia.asistencia (
            cod_estudiante, id_asig_periodo, fecha_asistencia, hora_asistencia, id_estado_asis
        ) VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            cod_estudiante, 7, fecha_actual, hora_actual, estado_asistencia
        ))

        conn.commit()
        print("✅ Insert realizado correctamente.")
    except Exception as e:
        print(f"❌ Error al insertar en la base de datos: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
            
# if __name__ == '__main__':
#    validar_estudiante("1144106768")

