#prepara los datos, que voy a usar para analizarlo

# modelo/src/preprocessing.py

import pandas as pd
import sys
import os

# Agregar ruta al nivel raíz del proyecto para importar correctamente
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# Importar la conexión desde /db/conexion.py
from db.conexion import get_connection

def load_data_from_db():
    connection = get_connection()

    query = """
        SELECT 
            a.id_estudiante,
            a.id_clase,
            a.fecha_asistencia,
            a.hora_asistencia,
            a.estado,
            c.fecha AS fecha_clase,
            c.hora_inicio,
            c.hora_fin
        FROM asistencia.asistencia a
        INNER JOIN asistencia.clases c ON a.id_clase = c.id_clases	
    """

    df = pd.read_sql_query(query, connection)
    connection.close()
    return df

def clean_data(df):
    # Convertir fechas y horas a formatos útiles
    df["fecha_clase"] = pd.to_datetime(df["fecha_clase"])
    df["fecha_asistencia"] = pd.to_datetime(df["fecha_asistencia"])
    df["hora_asistencia"] = pd.to_datetime(df["hora_asistencia"], format="%H:%M:%S").dt.hour
    df["hora_inicio"] = pd.to_datetime(df["hora_inicio"], format="%H:%M:%S").dt.hour
    df["hora_fin"] = pd.to_datetime(df["hora_fin"], format="%H:%M:%S").dt.hour

    return df
