from db.conexion import get_connection


def validar_estudiante(cedula):
    try:
        # Obtener la conexión a la base de datos
        conn = get_connection()
        cursor = conn.cursor()

        # Consulta SQL con parámetros parametrizados
        query = "SELECT * FROM asistencia.usuarios u WHERE u.cedula = %s"
        cursor.execute(query, (cedula,))  # Pasamos el parámetro de forma segura

        # Obtener los resultados
        rows = cursor.fetchall()

        # Imprimir los resultados
        if rows:
            for row in rows:
                id_estudiante = row[0]
                print(row)
        else:
            print("No se encontraron registros con la cédula proporcionada.")

    except Exception as e:
        print(f"❌ Error al consultar en la base de datos: {e}")
    finally:
        # Asegurarse de cerrar el cursor y la conexión
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
            
            
def validar_clase(fecha):
    try:
        # Obtener la conexión a la base de datos
        conn = get_connection()
        cursor = conn.cursor()

        # Consulta SQL con parámetros parametrizados
        query = "select * from asistencia.clases c where fecha = %s"
        cursor.execute(query, (fecha,))  # Pasamos el parámetro de forma segura

        # Obtener los resultados
        rows = cursor.fetchall()

        # Imprimir los resultados
        if rows:
            for row in rows:
                id_clase = row[0]
                print(row)
        else:
            print("No se encontraron registros con la cédula proporcionada.")

    except Exception as e:
        print(f"❌ Error al consultar en la base de datos: {e}")
    finally:
        # Asegurarse de cerrar el cursor y la conexión
        if cursor:
            cursor.close()
        if conn:
            conn.close()   
            
                    
if __name__ == '__main__':
    # validar_estudiante(1144106768)
    
    validar_clase('2025-04-16')