from db.conexion import get_connection


def validar_estudiante(cedula):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = "SELECT * FROM asistencia.usuarios u WHERE u.cedula = %s"
        cursor.execute(query, (cedula,))
        row = cursor.fetchone()

        if row:
            id_estudiante = row[0]
            return id_estudiante
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

            
            
            
def validar_clase(fecha):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = "SELECT * FROM asistencia.clases c WHERE fecha = %s"
        cursor.execute(query, (fecha,))
        row = cursor.fetchone()

        if row:
            id_clase = row[0]
            return id_clase
        else:
            print("No se encontraron registros con la fecha proporcionada.")
            return None
    except Exception as e:
        print(f"❌ Error al consultar en la base de datos: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
 


def insert_asistencia(cedula, fecha_actual, hora_actual):
    try:
        id_estudiante = validar_estudiante(cedula)
        id_clase = validar_clase(fecha_actual)

        if id_estudiante is None or id_clase is None:
            print("❌ No se pudo obtener id_estudiante o id_clase.")
            return

        conn = get_connection()
        cursor = conn.cursor()

        query = """
        INSERT INTO asistencia.asistencia (
            id_estudiante, id_clase, fecha_asistencia, hora_asistencia, estado
        ) VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            id_estudiante, id_clase, fecha_actual, hora_actual, 1
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
#    insert_asistencia("1234567890", "2025-04-1", "08:00:00")

